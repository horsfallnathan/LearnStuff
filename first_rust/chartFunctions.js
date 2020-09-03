window.lang = JSON.parse(window.localStorage.locale)["lang"];

$(document).ready(function () {

    document.title = pageTitle;

    // $('.chartSteering').css("height", ($(window).innerHeight() - 150));

    $("#stackedArea").on("click", function () {
        charts[sourceURL]["stacking"] = "normal";
        applyAreaChartParameters();
    });

    $("#stackedPercent").on("click", function () {
        charts[sourceURL]["stacking"] = "percent";
        charts[sourceURL]["tooltipFooterFormat"] = "";
        applyAreaChartParameters();
    });

     $("#bar_stacked_percent").on("click", function () {
         console.log("dingelingeling");
        charts[sourceURL]["stacking"] = "percent";
        // charts[sourceURL]["tooltipFooterFormat"] = "";
        applyColumnChartParameters();
    });

    $("#line").on("click", function () {
        applyLineChartParameters();
    });


    $("#stacked").on("click", function () {
        if (charts[sourceURL]["groupedStacked"]) {
            createStackBackup(isChartCategorized());
        }
        charts[sourceURL]["stacking"] = "normal";
        showHideGroupedStackedOption();
        applyColumnChartParameters();

        $("#sum").attr("disabled", false);
    });

    $("#grouped").on("click", function () {
        console.log("huhu");
        if (charts[sourceURL]["groupedStacked"]) {
            createStackBackup(isChartCategorized());
        }
        charts[sourceURL]["stacking"] = undefined;
        showHideGroupedStackedOption();
        applyColumnChartParameters();

        $("#sum").attr("disabled", true);


    });

    //switch column charts into percent/absolute mode
    $("#percent").on("click", function() {
        charts[sourceURL]["stacking"] = "percent";
        applyColumnChartParameters();
    });
    $("#absolute").on("click", function() {
        charts[sourceURL]["stacking"] = "normal";
        applyColumnChartParameters();
    });


    $('#groupedStacked').on("click", function () {
        reverseBackupStack();
        showHideGroupedStackedOption();
        charts[sourceURL]["chart"].update(
            {
                tooltip: {
                    shared: false,
                    formatter: getFunctionForSplittedToolips(),
                }
            }
        );

        $("#sum").attr("disabled", false);
    });

    //unset week or month when the other one is selected
    $('#month').on("change", function () {
        if ($(this).find("option:selected").attr("value") != -1) {
            $('#week').find("option[value='-1']").prop("selected", true);
        }
    });

    $('#week').on("change", function () {
        if ($(this).find("option:selected").attr("value") != -1) {
            $('#month').find("option[value='-1']").prop("selected", true);
        }
    });

    $(".chartSteering .triggerDownload").on("change", function () {
        $('.loader').show();
        $('#pagetitle').hide();
        downloadChartData();
    });

    $('input[name=timezone]').on("click", function () {
        globalSettings["timezone"] = $(this).attr("value");
        if (isTimestamp(charts[sourceURL]["chart"]["xAxis"][0]["categories"][0])) {
            charts[sourceURL]["chart"].update({xAxis: createxAxisInput()}, true);
        }

        $(".lastUpdate").text(formatDate(charts[sourceURL]["lastUpdate"], true, true ));
    });

    //toggles main menu away to the side
    // $(".menuDriver").on("click", function() {
    //     let windowInnerWidth = $(window).innerWidth();
    //     console.log(windowInnerWidth);

    //     if ( $(this).hasClass("out")) {
    //         $(this).find("svg").remove();
    //         $(this).append(`<i class="fas fa-chevron-left"></i>`);
    //         $(this).addClass("in").removeClass("out");

    //         $("#chartSteering").animate({"left": "100%"}, 500);

    //         //resize the chart
    //         if (windowInnerWidth >= mobileVersionWindowWidth) {

    //             // $("#inhalt").animate({"width": "100%"});

    //             let width = $(window).width();
    //             let height = $("#chart").height();

    //             //holds for the d3 import/export chart
    //             if (typeof(charts[sourceURL]) !== "undefined") {
    //                 charts[sourceURL]["chart"].setSize(width, height, doAnimation = true);
    //                 $("#inhalt").animate({"width": "100%"});
    //             } else {
    //                 //country code table has 15% width
    //                 $("#inhalt").animate({"width": "85%"});
    //             }

    //             let newLeft = $(window).innerWidth() - 50
    //             $(".menuDriver").animate({"left": newLeft + "px"}, 500);
    //         } else {
    //             $(".menuDriver").animate({"left": "-57px"}, 500);
    //         }



    //     } else {
    //         $(this).find("svg").remove();
    //         $(this).append(`<i class="fas fa-chevron-right"></i>`);

    //         $(this).addClass("out").removeClass("in");

    //         if (windowInnerWidth >= mobileVersionWindowWidth) {

    //             $("#chartSteering").animate({"left": "78%"}, 500);

    //             let newLeft = ($(window).innerWidth() / 100 * 78) - 50
    //             $(".menuDriver").animate({"left": newLeft + "px"}, 500);


    //             let width = $(window).width() / 100 * 78;
    //             let height = $("#chart").height();

    //             //holds for the d3 import/export chart
    //             if (typeof(charts[sourceURL]) !== "undefined") {
    //                 charts[sourceURL]["chart"].setSize(width, height, doAnimation = true);
    //                 $("#inhalt").animate({"width": "78%"});
    //             } else {
    //                 //country code table has 15% width
    //                 $("#inhalt").animate({"width": "63%"});
    //             }
    //         } else {
    //             $("#chartSteering").animate({"left": "0%"}, 500);
    //             $(".menuDriver").animate({"left": "0px"}, 500);
    //         }
    //     }
    // });


});

//this function adjusted the output, which is shown in the tooltip, shown when
//the user hovers over a diagram
function pointFormatterFunction(_this) {
    var sum = 0;
    if (charts[sourceURL]["series"][0]["xAxisLabel"][0]["en"] === "Month") {
        //write the month`name rather than its number
        let Xvalue = _this;
        for (let key in charts[sourceURL]["xAxisTooltipAccessPath"]) {
            Xvalue = Xvalue[charts[sourceURL]["xAxisTooltipAccessPath"][key]];
        }


        var output = "<b>" + convertMonthNumberToMonthName(Xvalue) + "</b>";
        output += getSplitLineForTooltip();

    }
    else if (charts[sourceURL]["series"][0]["xAxisLabel"][0]["en"] === "Week") {
        let Xvalue = _this;
        for (let key in charts[sourceURL]["xAxisTooltipAccessPath"]) {
            Xvalue = Xvalue[charts[sourceURL]["xAxisTooltipAccessPath"][key]];
        }

        var output = "<b>" + translate("Woche") + " " + Xvalue + "</b>";
        output += getSplitLineForTooltip();

    } else {
        if (_this.points !== undefined) {
            var output = showTimeHeader(_this.points[0], "key");
        } else {
            var output = showTimeHeader(_this.point, "key");
        }
    }

    var count = 0;
    var decimalPlaces = "";
    var afterSumOutput = "";
    var countOutputsPriotStroke = 0;

    let iterateOver = _this.points;

    $.each(_this.points, function (i, point) {
        if (point.series.yAxis.opposite) {
            var unit = charts[sourceURL]["y1AxisUnit"];
            decimalPlaces = charts[sourceURL]["y1AxisDecimalPlaces"];
        } else {
            var unit = charts[sourceURL]["y0AxisUnit"];
            decimalPlaces = charts[sourceURL]["y0AxisDecimalPlaces"];
        }

        //in the percentage display the load value can't be properly displayed, so show it as standard in GW
        if (charts[sourceURL]["stacking"] === "percent" &&
            point.series.userOptions.ignoreForTooltipSum !== true &&
            unit === charts[sourceURL]["y0AxisUnit"]
        ) {
            output += '<span class="legendDot" style="color:' + point.color + ';">\u25CF</span> <b>' + point.series.name + '</b>: ' +
                point.percentage.toFixed(decimalPlaces) + '%<br/>';
            countOutputsPriotStroke++;
        } else {
            //calc wich prop from the point to display as y-Value
            let value = point;
            for (let key in charts[sourceURL]["yAxisTooltipAccessPath"]) {
                value = value[charts[sourceURL]["yAxisTooltipAccessPath"][key]];
            }

            //series which differ from the main type of the chart or belong to another stack shall not be mentioned
            //within the calculation of the sum, but rather be appeneded after the sum
            let append = '<span style="color:' + point.color + ';">\u25CF</span> <b>' + point.series.name + '</b>: ' +
                value.toFixed(decimalPlaces) + " " + unit + '<br/>';
            if (unit === charts[sourceURL]["y1AxisUnit"] ||
                point.series.userOptions.stack !== "one" && typeof(point.series.userOptions.stack) !== "undefined" ||
                point.series.type !== charts[sourceURL]["chartType"]) {
                afterSumOutput += append;
            } else {
                output += append;
                count += 1;
                sum += point.y;
            }
        }

    });

    if (charts[sourceURL]["stacking"] !== "percent" && count > 1 && typeof (charts[sourceURL]["hideSumInTooltip"]) === "undefined") {
        output += getSplitLineForTooltip();
        output += '<b>' + translate("Summe") + '</b>: ' + sum.toFixed(decimalPlaces) + " " + charts[sourceURL]["y0AxisUnit"] + "<br>";
    }

    if (afterSumOutput !== "") {
        if (countOutputsPriotStroke > 0) output += getSplitLineForTooltip()
        output += afterSumOutput;
    }

    return output;
}

//every chart has unique options, which are being loaded here and combined with the "gloabl" settings,
//so they can be loaded in the createChart function
function loadChartTypeDefs() {
    if (charts[sourceURL]["chartType"] == "line") {
        loadLineChartParameters();
    } else if (charts[sourceURL]["chartType"] == "area") {
        loadAreaChartParameters();
    } else if (charts[sourceURL]["chartType"] == "column") {
        loadColumnChartParameters();
    } else if (charts[sourceURL]["chartType"] == "scatter") {
        loadScatterChartParameters();
    } else if (charts[sourceURL]["chartType"] == "variablepie") {
        loadVariablepieChartParameters();
    } else if (charts[sourceURL]["chartType"] == "dependencywheel") {
        loadDependencywheelChartParameters();
    }

    let localPlotOptions =
        {
            series: {
                // connectNulls: false,
                lineWidth: charts[sourceURL]["seriesLineWidth"],
                keys: charts[sourceURL]["keys"],
                states: {
                    inactive: {
                        opacity: 1
                    },
                },
                animation: false,
                pointPadding: 0,
                borderWidth: 0,
                shadow: false,
                showInLegend: charts[sourceURL]["showInLegend"],
            }
        };
    window.mergedPlotOptions = $.extend(localPlotOptions, plotOptions);

    let localTooltipOptions = {
        shared: charts[sourceURL]["tooltipShared"],
        backgroundColor: 'white',
        useHTML: true,
    };
    window.mergedTooltipOptions = $.extend(localTooltipOptions, tooltipOptions);

    //switch height based on mobile/desktop

    console.log($('#chartSteering').innerHeight());
    let height = ($(window).innerWidth() >= mobileVersionWindowWidth) ? $('#chartSteering').innerHeight() - $('#pagetitle').innerHeight() : $(document).innerHeight() - 280;

    let localChartOptions = {
        alignTicks: false,
        type: charts[sourceURL]["chartType"],
        // height: height,
        renderTo: charts[sourceURL]["renderTo"],
        backgroundColor: "transparent",
        events: {
            load: function () {
                this.series.forEach(function (s) {
                    if (!s.baseSeries) {
                        Highcharts.removeEvent(s, 'show');
                        Highcharts.removeEvent(s, 'hide');
                    }
                });
            },
            exportData: function () {
                alert("export");
            },
            beforePrint: function () {
                charts[sourceURL]["chart"].update({
                    title: {
                        text: "<div class='customTitleContainer' style='width: 100%; left: 0; text-align: center;'>" +
                            "<div style='width: 15%; float: left;'>Energy-charts</div>" +
                            "<div style='width: 70%; float: left; '>" + charts[sourceURL]["name"][window.lang] + "</div>" +
                            "<div style='width: 15%; float: left;'><img src='https://www.solarify.eu/wp-content/uploads/2013/01/Fraunhofer-ISE-logo.png' style='height: 30px;'></div>" +
                            '</div>',
                        useHTML: true,
                        style: {
                            fontSize: "14px",
                            width: "100%"
                        }
                    },
                }, true);
            },
            afterPrint: function() {
                charts[sourceURL]["chart"].update({
                    title: {
                        text: undefined
                    },
                    subtitle: {
                        text: undefined
                    }
                }, true);
            }
        },
    };

    window.mergedChartOptions = $.extend(localChartOptions, chartOptions);
}

function createChart(_sourceURL = null) {
    console.log("create chart");
    $('.loader').show();

    getYAxisUnit(0);
    // console.log("create chart", charts[sourceURL]);

    defineDefaultValues();
    if (charts[sourceURL]["showSecondYAxis"]) {
        getYAxisUnit(1);
    }


    if (charts[sourceURL]["chartType"] == "column" && charts[sourceURL]["groupedStacked"]) {
        let clearLiveStack = $("#groupedStacked").prop("checked") == true ? false : true;
        createStackBackup(false, clearLiveStack);
    }

    if (_sourceURL != null) {
        window.sourceURL = _sourceURL;
    }

    loadChartTypeDefs();
    let maxLegendHeight = $("#chart").innerHeight() / 100 * 20;

    charts[sourceURL]["chart"] = new Highcharts.chart(charts[sourceURL]["renderTo"], {
        chart: mergedChartOptions,
        colors: charts[sourceURL]["colors"],
        title: {
            text: undefined
        },
        xAxis: createxAxisInput(),
        yAxis: createyAxisInput(),
        legend: {
            // align: 'right',
            // x: 0,
            // verticalAlign: 'bottom',


            marginTop: 10,
            // width: "90%",
            // y: 0,
            maxHeight: maxLegendHeight,

        },
        tooltip: mergedTooltipOptions,
        plotOptions: mergedPlotOptions,
        navigator: {
            enabled: charts[sourceURL]["navigator"],
            adaptToUpdatedData: true,
            height: 25,
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    enabled: false,
                }
            },
            xAxis: {
                title: {
                    text: null
                },
                labels: {
                    enabled: false,
                }
            }
        },
        exporting: {
            enabled: false,
            scale: 1,
            sourceWidth: 842,
            sourceHeight: 595,
            fallbackToExportServer: true,
            allowHTML: true,
            chartOptions: {
                title: {
                    text: "<div class='customTitleContainer' style='width: 100%; left: 0; text-align: center;'>" +
                        "<div style='width: 15%; float: left;'>Energy-charts</div>" +
                        "<div style='width: 70%; float: left; '>" + charts[sourceURL]["name"][window.lang] + "</div>" +
                        "<div style='width: 15%; float: left;'><img src='https://www.solarify.eu/wp-content/uploads/2013/01/Fraunhofer-ISE-logo.png' style='height: 30px;'></div>" +
                        '</div>',
                    useHTML: true,
                    style: {
                        fontSize: "14px",
                        width: "100%"
                    }
                },
                subtitle: {
                    text: translate("Datenquelle") + ": " + charts[sourceURL]["datasource"] + ";   " +
                        translate("letztes Update") + ": " + formatDate(charts[sourceURL]["lastUpdate"], true, true, true),
                    style: {
                        fontSize: "10px",
                        position: "relative",
                        top: "10px"
                    },
                    verticalAlign: "bottom"
                },
            }
        },
        series: charts[sourceURL]["series"],
        time: {
            useUTC: false
        },
    });

    charts[sourceURL]["chartRendered"] = true;

    if (charts[sourceURL]["stacking"] == "percent") {
        charts[sourceURL]["tooltipFooterFormat"] = "";
    }

    if (charts[sourceURL]["chartType"] == "column" && charts[sourceURL]["groupedStacked"]) {
        showHideGroupedStackedOption();
    }

    $('#pagetitle').text(charts[sourceURL]["name"][window.lang]);
    $('.loader').hide();
    $('#chart').show();
    $(".noData").hide();
    $('.comments').empty();

    if (typeof (charts[sourceURL]["comment"]) != "undefined") {
        $('.comments').append("<div class='row pureTextRow'>" + charts[sourceURL]["comment"] + "</div>");
    }

    //doubled in exporting functions when adjusting this please update exporting functions
    $('.comments').append("<div class='row pureTextRow'>" + translate("Datenquelle") + ": " + charts[sourceURL]["datasource"] + "</div>");
    let date = charts[sourceURL]["lastUpdate"];
    $('.comments').append("<div class='row pureTextRow'>" + translate("letztes Update") + ":&nbsp; <span class='lastUpdate'>" + formatDate(date, true, true) + "</span></div>");

    formerSourceURL = sourceURL;
    $('#pagetitle').text(charts[sourceURL]["name"][window.lang]);
    $('#pagetitle').show();

    if (charts[sourceURL]["showExtremeValueTable"]) {
        createMinMaxTable();
    } else {
        $(".extremeValueTableButton").hide();
    }

    if (charts[sourceURL]["groupedStacked"]) {
        applyGroupedStackedAreaChartParameters();
    }

    //calculation is based on values which are calculated in the diagram itself, so you
    //cannot calc them before the initialization of the diagram
    if (charts[sourceURL]["chartType"] != undefined && charts[sourceURL]["chartType"] != "scatter" && charts[sourceURL]["navigator"]) {
        adaptTickIntervalToNavigatorResize();
    }

    if (charts[sourceURL]["stacking"] == undefined) {
        $("#sum").attr("checked", false).attr("disabled", true);
    }

    $('#chart').show();

}

//extracts the yAxis Unit(s) from the give json data file
function getYAxisUnit(_axisIndex = "0") {
    let yAxisUnit = "";
    charts[sourceURL]["y" + _axisIndex + "AxisUnit"] = "";

    //Unit is related to a special chart type
    if (charts[sourceURL]["chartType"] === "dependencywheel") {
        yAxisUnit = "GWh";
    } else if (charts[sourceURL]["chartType"] === "variablepie") {
        if (sourceURL.indexOf("DependantSeries") === -1) {
            yAxisUnit =
                charts[sourceURL]["series"][0]["data"][0]["y0AxisLabel"][0][window.lang].substr(0, 3);
        } else {
            yAxisUnit =
                charts[sourceURL.replace("DependantSeries", "")]["series"][0]["data"][0]["y0AxisLabel"][0][window.lang].substr(0, 3);
        }
    } else {
        //unit is isolated from the yAxis Label
        let axisLabelName = "y" + _axisIndex + "AxisLabel";

        yAxisUnit = charts[sourceURL]["series"][0][axisLabelName][0][window.lang];
        if (yAxisUnit.indexOf("(") != -1 && yAxisUnit.indexOf("/") != -1) {
            // is the slash stapled?
            if (yAxisUnit.indexOf("/") == -1) {
                yAxisUnit = yAxisUnit.substr(yAxisUnit.indexOf("(") + 1, (yAxisUnit.indexOf(")") - yAxisUnit.indexOf("(") - 1));
            } else if (yAxisUnit.indexOf("(") < yAxisUnit.indexOf("/") && yAxisUnit.indexOf(")") > yAxisUnit.indexOf("/")) {
                //slash is stapled
                yAxisUnit = yAxisUnit.substr(yAxisUnit.indexOf("(") + 1, (yAxisUnit.indexOf(")") - yAxisUnit.indexOf("(") - 1));
            } else {
                //simple slash
                yAxisUnit = yAxisUnit.substr(yAxisUnit.indexOf("/") + 1);
            }
        } else if (yAxisUnit.indexOf("/") != -1) {
            yAxisUnit = yAxisUnit.substr(yAxisUnit.indexOf("/") + 1).replace(" ", "");
        } else if (yAxisUnit.indexOf("(") != -1) {
            yAxisUnit = yAxisUnit.substr(yAxisUnit.indexOf("(") + 1, (yAxisUnit.indexOf(")") - yAxisUnit.indexOf("(") - 1));
        } else {
            yAxisUnit = charts[sourceURL]["series"][0][axisLabelName][0][window.lang];
        }
    }

    charts[sourceURL]["y" + _axisIndex + "AxisUnit"] = yAxisUnit;
}

//extracts the xAxis Unit(s) from the give json data file
function getXAxisUnit() {
    xAxisUnit = charts[sourceURL]["xAxisTitle"];

    // is the slash stapled?
    if (xAxisUnit.indexOf("(") < xAxisUnit.indexOf("/") && xAxisUnit.indexOf(")") > xAxisUnit.indexOf("/")) {
        //slash is stapled
        xAxisUnit = xAxisUnit.substr(xAxisUnit.indexOf("(") + 1, (xAxisUnit.indexOf(")") - xAxisUnit.indexOf("(") - 1));
    } else {
        xAxisUnit = xAxisUnit.substr(xAxisUnit.indexOf("/") + 1).replace(" ", "");
    }
}

//returns the time, displayed in a given format to show in the tooltip in the chart
function showTimeHeader(_this, timekey = "category") {

    let output = "";
    if (isTimestamp(_this[timekey])) {
        let appendTimezone = true;
        if (charts[sourceURL]["hideTimeZoneInTooltip"]) appendTimezone = false;
        output += "<span class='localTime'>" + formatDate(_this[timekey], charts[sourceURL]["showTime"], appendTimezone);
        output += "</span>" + "<br/>";
    } else {
        output += "<span class='localTime'>" + formatDate(_this[timekey], charts[sourceURL]["showTime"]) + "</span>";
    }

    output += getSplitLineForTooltip();
    return output;
}

//defines all default settings for the current chart
function defineDefaultValues() {
    charts[sourceURL]["oldDataFormat"] = false;

    if (typeof (charts[sourceURL]["pointFormatterNames"]) == undefined) {
        charts[sourceURL]["pointFormatterNames"] = null;
    }

    charts[sourceURL]["keys"] = undefined;

    if (typeof (charts[sourceURL]["minxAxisIndex"]) == "undefined") {
        charts[sourceURL]["minxAxisIndex"] = undefined;
    }
    if (typeof (charts[sourceURL]["lineConnectNulls"]) == "undefined") {
        charts[sourceURL]["lineConnectNulls"] = false;
    }
    if (typeof (charts[sourceURL]["maxxAxisIndex"]) == "undefined") {
        charts[sourceURL]["maxxAxisIndex"] = undefined;
    }

    if (typeof (charts[sourceURL]["tickInterval"]) == "undefined" && typeof (charts[sourceURL]["xAxisValues"]) != "undefined") {
        if (!isTimestamp(charts[sourceURL]["xAxisValues"][0])) {
            charts[sourceURL]["tickInterval"] = Math.round(charts[sourceURL]["xAxisValues"].length / 6);
        } else {
            console.log("is timestamp", charts[sourceURL]["xAxisValues"], charts[sourceURL]["xAxisValues"][charts[sourceURL]["xAxisValues"].length -1] - charts[sourceURL]["xAxisValues"][0]);
            charts[sourceURL]["tickInterval"] = (charts[sourceURL]["xAxisValues"][charts[sourceURL]["xAxisValues"].length -1] - charts[sourceURL]["xAxisValues"][0]) / 6;
            charts[sourceURL]["tickInterval"] = charts[sourceURL]["xAxisValues"].length / 6;
        }
    }



    if (typeof (charts[sourceURL]["yAxisTickInterval"]) == "undefined") {
        charts[sourceURL]["yAxisTickInterval"] = undefined;
    }

    if (typeof (charts[sourceURL]["dateFormat"]) == "undefined") {
        charts[sourceURL]["dateFormat"] = '%d.%m.%Y %H:%M';
    }

    if (typeof (charts[sourceURL]["showYAxis"]) == "undefined") {
        charts[sourceURL]["showYAxis"] = true;
    }

    if (charts[sourceURL]["dateFormat"] == false) {
        charts[sourceURL]["tootlipHeaderFormat"] = '<span style="font-size: 10px">{point.x}</span><br/>';
    } else {
        charts[sourceURL]["tootlipHeaderFormat"] = '';
    }

    if (charts[sourceURL]["chartType"] == "scatter") {
        charts[sourceURL]["keys"] = ['name', 'x', 'y'];
    }

    // if (typeof(charts[sourceURL]["tooltipDateFormat"]) == undefined ) {
    //     charts[sourceURL]["dateFormat"] = charts[sourceURL]["tooltipDateFormat"];
    // }

    if (typeof (charts[sourceURL]["stacking"]) == "undefined") {
        charts[sourceURL]["stacking"] = undefined;
    }

    if (typeof (charts[sourceURL]["tooltipFooterFormat"]) == "undefined") {
        charts[sourceURL]["tooltipFooterFormat"] = getSplitLineForTooltip() + '<b>' + translate('Summe') + ': </b>{point.total} ' + ' ' + charts[sourceURL]["y0AxisUnit"];
    }

    if (charts[sourceURL]["series"][0]["xAxisLabel"] == undefined) {
        charts[sourceURL]["xAxisTitle"] = "";
    } else {
        charts[sourceURL]["xAxisTitle"] = charts[sourceURL]["series"][0]["xAxisLabel"][0][window.lang];
    }

    if (charts[sourceURL]["series"][0]["y0AxisLabel"] === undefined) {
        charts[sourceURL]["y0AxisTitle"] = "";
    } else {
        charts[sourceURL]["y0AxisTitle"] = charts[sourceURL]["series"][0]["y0AxisLabel"][0][window.lang];
    }

    if (charts[sourceURL]["series"][0]["y1AxisLabel"] === undefined) {
        charts[sourceURL]["y1AxisTitle"] = "";
    } else {
        charts[sourceURL]["y1AxisTitle"] = charts[sourceURL]["series"][0]["y1AxisLabel"][0][window.lang];
    }

    if (typeof (charts[sourceURL]["innerChartTitleFormat"]) == "undefined") {
        charts[sourceURL]["innerChartTitle"] = null;
    } else {
        calcPieChartSum();
    }

    if (typeof (charts[sourceURL]["renderTo"]) == "undefined") {
        charts[sourceURL]["renderTo"] = "chart";
    }

    if (typeof (charts[sourceURL]["pieShowInLegend"]) == "undefined") {
        charts[sourceURL]["pieShowInLegend"] = true;
    }
    if (typeof (charts[sourceURL]["navigator"]) == "undefined") {
        charts[sourceURL]["navigator"] = false;
    }

    if (typeof (charts[sourceURL]["navigatorSeries"]) == "undefined") {
        charts[sourceURL]["navigatorSeries"] = "sum";
    }

    if (typeof (charts[sourceURL]["showExtremeValueTable"]) == "undefined") {
        charts[sourceURL]["showExtremeValueTable"] = true;
    }

    if (typeof (charts[sourceURL]["groupedStacked"]) == "undefined") {
        charts[sourceURL]["groupedStacked"] = false;
    }

    if (typeof (charts[sourceURL]["showInLegend"]) == "undefined") {
        charts[sourceURL]["showInLegend"] = false;
    }

    if (typeof (charts[sourceURL]["xAxisShowTime"]) == "undefined") {
        charts[sourceURL]["xAxisShowTime"] = false;
    }

    if (typeof (charts[sourceURL]["showSecondYAxis"]) == "undefined") {
        charts[sourceURL]["showSecondYAxis"] = false;

        //check the data for the second yAxis
        for (let data in charts[sourceURL]["series"]) {
            if (Object.keys(charts[sourceURL]["series"][data]).includes("yAxis")
            && charts[sourceURL]["series"][data]["yAxis"] > 0) {
                charts[sourceURL]["showSecondYAxis"] = true;
                break;
            }
        }
    }

    if (typeof (charts[sourceURL]["yAxisLabel"]) == "undefined") {
        if (typeof (charts[sourceURL]["series"][0]["y1AxisLabel"]) == "undefined") {
            charts[sourceURL]["yAxisLabel"] = "";
        } else {
            charts[sourceURL]["yAxisLabel"] = charts[sourceURL]["series"][0]["y1AxisLabel"][0][window.lang];
        }
    }

    if (typeof (charts[sourceURL]["colors"]) == "undefined") {
        charts[sourceURL]["colors"] = ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"];
    }

    if (typeof (charts[sourceURL]["tooltipShared"]) == "undefined") {
        charts[sourceURL]["tooltipShared"] = true;
    }

    if (typeof (charts[sourceURL]["seriesLineWidth"]) == "undefined") {
        charts[sourceURL]["seriesLineWidth"] = 0;
    }

    charts[sourceURL]["yAxisCount"] = 1;
    for (let dataset in charts[sourceURL]["series"]) {
        if (Object.keys(charts[sourceURL]["series"][dataset]).indexOf("yAxis") != -1) {
            charts[sourceURL]["yAxisCount"] = 2;
        }
    }

    if (typeof (charts[sourceURL]["showTime"]) == "undefined") {
        charts[sourceURL]["showTime"] = true;
    }

    if (typeof (charts[sourceURL]["y0AxisDecimalPlaces"]) == "undefined") {
        charts[sourceURL]["y0AxisDecimalPlaces"] = 2;
    }

    if (typeof (charts[sourceURL]["xAxisDecimalPlaces"]) == "undefined") {
        charts[sourceURL]["xAxisDecimalPlaces"] = 2;
    }

    if (charts[sourceURL]["yAxisTooltipAccessPath"] === undefined) {
        charts[sourceURL]["yAxisTooltipAccessPath"] = ["y"];
    }

    if (charts[sourceURL]["xAxisTooltipAccessPath"] === undefined) {
        charts[sourceURL]["xAxisTooltipAccessPath"] = ["x"];
    }
}

function getSplitLineForTooltip() {
    return '<hr style="border: #A0A0A0 1px; background-color: #A0A0A0;height:1px; margin:10px 0; padding:0;"/>';
}

//returns d given input date based on the other parameters
//displayUTCName: false: write "your local time", true: write "UTC+x"
function formatDate(date, showTime = true, appendTimezone = false, displayUTCName = false) {
    var timezone = globalSettings["timezone"];
    if (typeof (date) != "string" && date > 944957534) {
        date = new Date(date);

        let timeZoneName = "";
        if (appendTimezone) {
            let foreignTimeZoneName =  "Ihre Zeitzone";
            var UTCtimezone =  new Date().getTimezoneOffset()
            if (displayUTCName && globalSettings["timezone"] !== "germany") {
                foreignTimeZoneName = "UTC";
                foreignTimeZoneName += UTCtimezone <= 0 ? "+": "";
                foreignTimeZoneName += (UTCtimezone / 60) * -1;
            }
            timeZoneName = (timezone === "germany" ? (" (" + translate("Ortszeit") + ")") : (" (" + translate(foreignTimeZoneName) + ")"))
        }

        if (!showTime) {
            if (timezone === "germany") {
                let output = date.toLocaleDateString(undefined, {timeZone: "Europe/Berlin"});
                if (appendTimezone) output += timeZoneName;
                return output;
            } else {
                // return date.toLocaleDateString("en-US", {timeZone: "America/New_York"});
                // return date.toLocaleDateString(undefined, {timeZone: "Europe/London"});
                let output = date.toLocaleDateString();
                if (appendTimezone) output += timeZoneName;
                return output;
            }
        } else {
            if (timezone === "germany") {
                let output = date.toLocaleString(undefined, {
                    timeZone: "Europe/Berlin",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: 'numeric',
                    minute: '2-digit'
                });
                if (appendTimezone) output += timeZoneName;
                return output;
            } else {
                // return date.toLocaleString("en-US", {timeZone: "America/New_York"});
                // return date.toLocaleString(undefined, {timeZone: "Europe/London", day: "2-digit", month:"2-digit", year:"numeric", hour: 'numeric', minute: '2-digit'});
                let output = date.toLocaleString(undefined, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: 'numeric',
                    minute: '2-digit'
                });
                if (appendTimezone) output += timeZoneName;
                return output;
            }
        }
    } else {
        return date;
    }
}

//creates a Menu, in which the user can choose, wheter to show all times in the chart as in his timezone
//or in the local time
function createTimeZoneRadioMenu() {
    var buttons = {
        1: {"title": "Ortszeit", "name": "timezone_germany", "value": "timezone_germany"},
        2: {"title": "Ihre Zeitzone", "name": "timezone_user", "value": "timezone_user"},
    };

    return createRadioMenue("Zeitangaben", buttons, "timezone", "timezone_germany", "h2", false);
}

//fill in the "Decirption" section in the main menu
function defineCommentValues(data) {

    if (charts[sourceURL]["series"][0]["comment"] != undefined) {
        charts[sourceURL]["comment"] = charts[sourceURL]["series"][0]["comment"][0][window.lang];
    }

    if (charts[sourceURL]["xAxisValues"] === undefined) {
        charts[sourceURL]["xAxisValues"] = charts[sourceURL]["series"][0]["xAxisValues"];
    }

    //choose the current language for the Legend items
    if (typeof (charts[sourceURL]["series"][0]["name"]) == "object" || typeof (charts[sourceURL]["series"][1]) != "undefined" && typeof (charts[sourceURL]["series"][1]["name"]) == "object") {
        for (let index in charts[sourceURL]["series"]) {
            charts[sourceURL]["series"][index]["name"] = charts[sourceURL]["series"][index]["name"][0][window.lang];
        }
    }

    charts[sourceURL]["datasource"] = charts[sourceURL]["series"][0]["datasource"];
    charts[sourceURL]["lastUpdate"] = new Date((parseInt(charts[sourceURL]["series"][0]["date"])));
    charts[sourceURL]["pageTitle"] = charts[sourceURL]["series"][0]["chartTitle"];

    if (typeof (charts[sourceURL]["y0AxisLabelPercent"]) == "undefined" &&
        typeof (charts[sourceURL]["series"][0]["y0AxisLabelPercent"]) != "undefined") {
        charts[sourceURL]["y0AxisLabelPercent"] = charts[sourceURL]["series"][0]["y0AxisLabelPercent"][0][window.lang];
    }

    if (typeof (charts[sourceURL]["y1AxisLabelPercent"]) == "undefined" &&
        typeof (charts[sourceURL]["series"][0]["y1AxisLabelPercent"]) != "undefined") {
        charts[sourceURL]["y1AxisLabelPercent"] = charts[sourceURL]["series"][0]["y1AxisLabelPercent"][0][window.lang];
    }

    charts[sourceURL]["pageTitle"] = charts[sourceURL]["series"][0]["chartTitle"][0];
    charts[sourceURL]["name"] = charts[sourceURL]["series"][0]["chartTitle"][0];
}

function clone(base) {
    const newArray = [];

    for (let index in Object.keys(base)) {
        var name = Object.keys(base)[index];
        newArray[name] = base[name];
    }
    return newArray;
}

function getUrlVariables() {
    window.URLvariables = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        if (value.indexOf(",") !== -1 || key === "dwdStationsID") {
            value = value.split(",");
        }
        URLvariables[key] = value;
    });

    window.globalSettings = URLvariables;

    return URLvariables;
}

//based on the Variables in the URL, iterate through the buttons in the menu an "click" and the ones
//which have to be turned on
function resolveURLVariables() {
    console.log("resolveURLVariables");
    let urlVars = getUrlVariables();
    for (let key in urlVars) {
        if (typeof (urlVars[key]) !== "object")
        {
            if (key != "datetimepicker") {
                $('#' + key + " option[value=" + urlVars[key] + "]").attr("selected", true).prop("selected", true);
                $('#' + key).val(urlVars[key]).change();

                $('input[name=' + key + '][value=' + urlVars[key] + ']:not([type=checkbox])')
                    .attr("checked", true)
                    .prop("selected", true)
                // .trigger("click");

                console.log($('input[name=' + key + '][value=' + urlVars[key] + ']:not([type=checkbox])'));
                //holds for checkboxes
                if (urlVars[key] == "1") {
                    $('input[name=' + key + ']').prop("checked", true);
                }
            } else {
                var date = urlVars["datetimepicker"].split(".");
                date = new Date(date[2], date[1] - 1, date[0]);

                var datestring = ("0" + date.getDate()).slice(-2) + "." + ("0" + (date.getMonth() + 1)).slice(-2) + "." +
                    date.getFullYear();

                $('#datetimepicker').datepicker()
                    .val(datestring)
                // .trigger('change')
            }
        }
    }

    //set selected values in URL (not only the one given above)
    $('#chartSteering select').each(function (e) {
        setURLVar($(this).attr("id"), $(this).find("option:selected").attr("value"));
    });

    $('#chartSteering input[type=radio]:checked').each(function (e) {
        setURLVar($(this).attr("name"), $(this).attr("value"));
    });

    $('#chartSteering input[type=checkbox]').each(function (e) {
        setURLVar($(this).attr("name"), ($(this).is(":checked") ? "1" : "0"));
    });

    $('#chartSteering input:not([type=checkbox])').on("change", function () {
        setURLVar($(this).attr("name"), $(this).val());
    });

    $('#chartSteering input[type=checkbox]').on("click", function () {
        setURLVar($(this).attr("name"), ($(this).is(":checked") ? "1" : "0"));
    });

    $('#chartSteering select').on("change", function () {
        setURLVar($(this).attr("name"), $(this).find("option:selected").attr("value"));
    });
}

//Iterate through the menu items and note everything to the URL, so this can be shared and shows the exact same chart
function setURLVar(_parameter, _value) {
    globalSettings[_parameter] = _value;

    if (_parameter != undefined && _value != undefined) {
        let link = window.location.href;
        let begin = link.indexOf("?") + 1;
        if (link.indexOf("?") == -1) {
            begin = link.length;
        }
        let paramString = window.location.href.substr(begin, (link.length - link.indexOf("?")))
        let params = paramString.split("&");

        for (let key in params) {
            let val = params[key];
            params[val.split("=")[0]] = val.split("=")[1];
            delete (params[key]);
        }
        params[_parameter] = _value;

        for (let key in params) {
            if (key != undefined && params[key] != undefined) {
                params.push(key + "=" + params[key]);
            }
            delete (params[key]);
        }

        let url = params.join("&");
        url = params.filter(x => x != undefined).join("&");

        return window.history.replaceState('', '', "?" + url);
    }

}

//caculates the min and max values from the json file and displays them in a table called "min max table"
function createMinMaxTable() {
    var result = [];

    //calc min max from the data
    for (let key in charts[sourceURL]["series"]) {
        // console.log(charts[sourceURL]["series"]);
        var arrayIndex = charts[sourceURL]["series"][key]["name"];
        for (let index in charts[sourceURL]["series"][key]["data"]) {

            if (typeof (result[arrayIndex]) == "undefined") {
                result[arrayIndex] = [];
                result[arrayIndex]["min"] = [];
                result[arrayIndex]["max"] = [];
                result[arrayIndex]["min"]["val"] = undefined;
                result[arrayIndex]["max"]["val"] = undefined;
            }

            if (result[arrayIndex]["min"]["val"] >= charts[sourceURL]["series"][key]["data"][index] || result[arrayIndex]["min"]["val"] == undefined) {
                result[arrayIndex]["min"]["val"] = charts[sourceURL]["series"][key]["data"][index];
                result[arrayIndex]["min"]["timestamp"] = charts[sourceURL]["xAxisValues"][index];
                let yAxisIndex = charts[sourceURL]["series"][key]["yAxis"];
                if (typeof(yAxisIndex) == "undefined") yAxisIndex = 0;
                result[arrayIndex]["unit"] = charts[sourceURL]["y"+yAxisIndex+"AxisUnit"];
            }

            if (result[arrayIndex]["max"]["val"] <= charts[sourceURL]["series"][key]["data"][index] || result[arrayIndex]["max"]["val"] == undefined) {
                result[arrayIndex]["max"]["val"] = charts[sourceURL]["series"][key]["data"][index];
                result[arrayIndex]["max"]["timestamp"] = charts[sourceURL]["xAxisValues"][index];
                let yAxisIndex = charts[sourceURL]["series"][key]["yAxis"];
                if (typeof(yAxisIndex) == "undefined") {
                    yAxisIndex = 0;
                }
                result[arrayIndex]["unit"] = charts[sourceURL]["y"+yAxisIndex+"AxisUnit"];

            }

        }
    }

    let table = "";

    table += "<table id='data-table' class='table table-striped extremeValuesTable'>";

    table += "<tr>" +
        "<th>" + translate("Quelle") + "</th>" +
        "<th>" + translate("Minimum") + "</th>" +
        "<th>" + charts[sourceURL]["xAxisTitle"] + "</th>" +
        "<th>" + translate("Maximum") + "</th>" +
        "<th>" + charts[sourceURL]["xAxisTitle"] + "</th>" +
        "</tr>";

    for (let item in result) {
        if (result[item]["min"]["val"] == null) result[item]["min"]["val"] = "-";
        if (item != "undefined") {
            table += "<tr>";
            table += "<td>" + item + "</td>";
            table += "<td>" + result[item]["min"]["val"] + " " + result[item]["unit"] +  "</td>";
            table += "<td>" + formatDate(result[item]["min"]["timestamp"]) + "</td>";
            table += "<td>" + result[item]["max"]["val"] + " " + result[item]["unit"] + "</td>";
            table += "<td>" + formatDate(result[item]["max"]["timestamp"]) + "</td>";
            table += "</tr>";
        }
    }

    table += "</table>";

    $('.popup').empty().append(table);

    $(".extremeValueTableButton").remove();
    $("<button class='extremeValueTableButton'>" + translate("Extremwerttabelle") + "</button>").insertAfter($("#collapseDescription .row:last-child"));

    $('.extremeValueTableButton').on("click", function () {
        $(".sunglass").show();
    });

    $(".sunglass").on("click", function (e) {
        $(".sunglass").hide();
    });


}

function showHideGroupedStackedOption() {
    let series = charts[sourceURL]["series"];

    if (Object.keys(series[0]).indexOf("stack") != -1 && series[0]["stack"] != undefined && series[0]["stackBackup"] != undefined) {
        $("#groupedStacked").attr("disabled", false);
    } else {
        $("#groupedStacked").attr("disabled", true);

        if ($("#groupedStacked").prop("checked") == true) {
            $("#stacked").attr("checked", true).prop("checked", true).trigger("click");
        }
    }
}

//the object created here completely describes the yAxis (one or two) The output
//is the used in the create Chart function
function createyAxisInput() {
    let y0AxisDesc = (charts[sourceURL]["stacking"] === "percent") ? charts[sourceURL]["y0AxisLabelPercent"] : charts[sourceURL]["y0AxisTitle"];

    var yAxis0 = {
        title: {
            text: y0AxisDesc,
        },
        visible: charts[sourceURL]["showYAxis"],
        min: charts[sourceURL]["minyAxisIndex"],
        max: charts[sourceURL]["maxyAxisIndex"],
        reversedStacks: false,
        overflow: "allow",
        // tickInterval: charts[sourceURL]["tickInterval"],
    };

    var yAxis1 = {
        title: {
            text: charts[sourceURL]["y1AxisTitle"],
        },
        visible: charts[sourceURL]["showYAxis"],
        opposite: true,
        min: charts[sourceURL]["miny1AxisIndex"],
        max: charts[sourceURL]["maxy1AxisIndex"],
        reversedStacks: false,
        showEmpty: false,
        tickInterval: charts[sourceURL]["yAxisTickInterval"],
        overflow: "allow",
    };

    if (!charts[sourceURL]["showSecondYAxis"]) {
        return {...yAxisOptions, ...yAxis0};
    } else {
        let twoyAxis = [yAxis0, yAxis1];
        return $.extend(yAxisOptions, twoyAxis);
    }

}

//the object created here completely describes the xAxis. The output
//is the used in the create Chart function
function createxAxisInput() {
    var axisTitle = charts[sourceURL]["xAxisTitle"];
    // if (typeof (charts[sourceURL]["xAxisValues"]) != "undefined" && isTimestamp(charts[sourceURL]["xAxisValues"][0])) {
    if (typeof (charts[sourceURL]["xAxisValues"]) != "undefined" && isTimestamp(charts[sourceURL]["xAxisValues"][0])) {

        if (globalSettings["timezone"] == "germany") {
            axisTitle += " (" + translate("Ortszeit") + ")";
        } else if (globalSettings["timezone"] === "user") {
            axisTitle += " (" + translate("Ihre Zeitzone") + ")";
        }
    }

    let xAxis = {
        categories: charts[sourceURL]["xAxisValues"],
        title: {
            text: axisTitle
        },
        labels: {
            formatter: function () {
                if (charts[sourceURL]["dateFormat"] !== false) {
                    return formatDate(this.value, charts[sourceURL]["xAxisShowTime"]);
                } else {
                    return this.value;
                }
            },
        },
        tickInterval: charts[sourceURL]["tickInterval"],
        // tickPixelInterval: undefined,
        type: (charts[sourceURL]["dateFormat"] === false ? 'linear' : 'datetime'),
        min: charts[sourceURL]["minxAxisIndex"],
        max: charts[sourceURL]["maxxAxisIndex"],
        overflow: "allow",
        events: {
            afterSetExtremes: function (e) {
                if (charts[sourceURL]["chartRendered"] === true && charts[sourceURL]["navigator"])
                    adaptTickIntervalToNavigatorResize();
            },
        },
    };

    var axisTitle = charts[sourceURL]["xAxisTitle"];
    if (typeof (charts[sourceURL]["xAxisValues"]) != "undefined" && isTimestamp(charts[sourceURL]["xAxisValues"][0]))
        axisTitle += " (" + translate("Ihre Zeitzone") + ")";


    var xAxis2 = {
        min: charts[sourceURL]["minxAxisIndex"],
        max: charts[sourceURL]["maxxAxisIndex"],
        categories: charts[sourceURL]["xAxisValues"],
        title: {
            text: axisTitle,
        },
        labels: {
            formatter: function () {
                return this.value;
            },
        },
        tickInterval: charts[sourceURL]["tickInterval"],
        type: 'datetime',
        linkedTo: 0,
        opposite: true,
    };

    if (typeof(xAxisOptions) !== "undefined") {
        $.extend(xAxis, xAxisOptions);
    }

    if (typeof (charts[sourceURL]["hideSecondxAxis"]) == "undefined" || charts[sourceURL]["hideSecondxAxis"]) {
        return xAxis;
    } else
        return [xAxis, xAxis2];
}

function isTimestamp(_input) {
    if (typeof (_input) != "string" && _input > 944957534) return true;
    else return false;
}

//when the range in the navigator changes, the tick Interval (distance in which the dates show up on the xAxis)
//has to be rescheduled
function adaptTickIntervalToNavigatorResize() {
    if (typeof (charts[sourceURL]["xAxisValues"]) != "undefined" && isTimestamp(charts[sourceURL]["xAxisValues"][0])) {
        var maxNavigatorDate = Math.round(charts[sourceURL]["chart"].xAxis[0].getExtremes().max);
        var minNavigatorDate = Math.round(charts[sourceURL]["chart"].xAxis[0].getExtremes().min);

        var navigatorRange = maxNavigatorDate - minNavigatorDate;

        // if (navigatorRange / 8 <= 100) {
        //     if (charts[sourceURL]["showTime"] !== false) {
        //         charts[sourceURL]["xAxisShowTime"] = true;
        //     }
        // }

        charts[sourceURL]["tickInterval"] = Math.round(navigatorRange / 6);
        charts[sourceURL]["chart"].xAxis[0].options.tickInterval = charts[sourceURL]["tickInterval"];

        charts[sourceURL]["chart"].update({
            xAxis: {
                tickInterval: charts[sourceURL]["tickInterval"],
            }
        });
    }
}

//converts the index of the month to its name. 1 -> january
function convertMonthNumberToMonthName(_monthNumber){
    if (months[_monthNumber - 1] !== undefined) {
        return translate(months[_monthNumber - 1]);
    } else {
        return _monthNumber;
    }
}

//holds for the climate charts. When a list dwdStationsIDs is set in the URL, the corresponding
//stations are checked and are displayed in the graph. Commaseperate them in the URL for the selection of multiple station IDs
function resolveStationIDsFromURL() {
    for (let key in globalSettings["dwdStationsID"]) {
        let series = charts[sourceURL]["series"].findIndex(element => element["dwdStationsID"] == globalSettings["dwdStationsID"][key]);
        if (series !== -1) {
            charts[sourceURL]["chart"]["series"][series].setVisible(true);
        }
    }

}

