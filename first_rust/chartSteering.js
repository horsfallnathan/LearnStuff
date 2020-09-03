// returns a radiomenu of energy sources
//_title whether or not to headline the menu with the title "energysources"
//without: array of keys of the sources not to be mentioed in the printed menue
function createEnergySourceMenue(
  _title = true,
  without = [],
  titleLevel = "h2",
  _checked = "run_of_river_unit",
  _seasonal_name = "seasonal_storage_unit",
  triggerDownload = true,
  _collapseTitle = null
) {
  buttons = {
    1: { title: "Laufwasser", name: "hydro_run-of-river_unit" },
    2: { title: "Kernenergie", name: "nuclear_unit" },
    3: { title: "Braunkohle", name: "fossil_brown_coal_lignite" },
    4: { title: "Braunkohle Block", name: "fossil_brown_coal_lignite_unit" },
    5: { title: "Steinkohle", name: "fossil_hard_coal_unit" },
    6: { title: "&Ouml;l", name: "fossil_oil_unit" },
    7: { title: "Gas", name: "fossil_gas_unit" },
    8: { title: "M&uuml;ll", name: "waste_unit" },
    9: { title: "Pumpspeicher", name: "hydro_pumped_storage_unit" },
    10: { title: "Speicherwasser", name: "hydro_water_reservoir_unit" },
    11: { title: "Wind offshore", name: "wind_offshore_unit" },
    12: { title: "Wind onshore", name: "wind_onshore_unit" },
  };

  if (typeof _title != "string") {
    if (_title == false) {
      _title = "";
    } else {
      _title = translate("Blockscharfe Erzeugung");
    }
  }
  for (let value in without) {
    for (let item in buttons) {
      if (without[value] == buttons[item]["name"]) {
        delete buttons[item];
      }
    }
  }

  let output = createRadioMenue(
    _title,
    buttons,
    "source",
    _checked,
    titleLevel,
    triggerDownload,
    _collapseTitle,
    true
  );

  return output;
}

/**
 * Chart steering state from local storage
 */
const steeringState = localStorage.getItem("steeringState") || "expanded";

let currView = "desktop";
const collapseMenu = () => {
  if (currView === "mobile") {
    $("#steeringContainer").modal("hide");
    $("#steeringContainer").on("hidden.bs.modal", function () {
      $("#steeringContainer")
        .removeClass("modal fade")
        .addClass("col-md-3")
        .removeAttr("style role tabindex aria-hidden");
      $("#modalDialog").removeClass("modal-dialog").removeAttr("role");
      $("#modalContent").removeClass("modal-content");
      $("#modalBody").removeClass("modal-body");
    });
    currView = "desktop";
  } else {
    const chartBox = document.querySelector("#inhalt");
    const steeringContainer = document.querySelector("#steeringContainer");
    const chartToggleButton = document.querySelector("#chartToggle");
    chartBox.classList.replace("col-md-9", "col-12");
    chartToggleButton.setAttribute("status", "collapsed");
    steeringContainer.setAttribute("status", "collapsed");
  }
  charts[sourceURL]["chart"].redraw();
  // Call createDateSelect function to re-append chart steering elements
  // localStorage.setItem('steeringState', 'collapsed')
};
const expandMenu = (origin) => {
  if (origin === "mobile") {
    currView = "mobile";
    $("#steeringContainer")
      .removeClass("col-md-3")
      .addClass("modal fade")
      .attr({ role: "dialog", tabindex: "-1" });

    $("#modalDialog").addClass("modal-dialog").attr({ role: "document" });
    $("#modalContent").addClass("modal-content");
    $("#modalBody").addClass("modal-body");
    $("#steeringContainer").modal("show");
  } else {
    const chartBox = document.querySelector("#inhalt");
    const steeringContainer = document.querySelector("#steeringContainer");
    const chartToggleButton = document.querySelector("#chartToggle");
    chartBox.classList.replace("col-12", "col-md-9");
    chartToggleButton.setAttribute("status", "expanded");
    steeringContainer.setAttribute("status", "expanded");
  }
  // localStorage.setItem('steeringState', 'expanded')
};

/**
 * Opens or closes chart steering
 * @param {String} action Takes action to be performed
 * @param {String} origin Mobile or Desktop view, mobile is important desktop is default
 */
const toggleSteering = (action, origin = "") => {
  action == "collapse" ? collapseMenu(origin) : expandMenu(origin);
};
//sets up the basic structure, needed for the creation of the chart. Everything else is appended into this frame
function createChartFrame() {
  let output = `<div class='wideContainer' chart-height >
    <div class='row'>
      <div id="inhalt" class="col-md-9">
        <div class='card chartCard'>
          <div class='card-body'>
            <div class='card-title'>
            <button type="button" bg-white id="chartToggle" onclick="toggleSteering('expand')" status='expanded'
              class='btn-circle btn-sm btn-outline-primary chartToggle' aria-label="Close">
              <span aria-hidden="true">&#x2630;</span>
            </button>
            <button type="button" bg-white data-toggle="modal" .d-none .d-sm-block .d-md-none
            onclick="toggleSteering('expand', 'mobile')" class='btn-circle btn-sm btn-outline-primary chartToggle'
              aria-label="Close">
              <span aria-hidden="true">&#x2630;</span>
            </button>
            </div>
            <h4 class=' pageTitle' id="pagetitle"></h4>
            <div class="chart" id="chart"></div>
            <div class="loader"></div>
            <div class="noData">${translate(
              "F&uuml;r diese Auswahl sind aktuell keine Daten verf&uuml;gbar."
            )}</div>
          </div>
        </div>
      </div>
      <div class="col-md-3" id="steeringContainer" status='expanded'>
      <div id='modalDialog'>
      <div id='modalContent'>
      <div id='modalBody'>
        <div class="card chartSteeringCard" overflow-y-overlay>
          <div class='card-body'>
            <div class='card-title chart-toggle-button'>
              <button type="button" onclick="toggleSteering('collapse')" bg-white
                class='btn-circle btn-sm btn-outline-primary' aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div id="desktopHandle">
            <div id="chartSteering" class="chartSteering">
              <div class="" id="accordion" role="tablist" aria-multiselectable="true"></div>
            </div>
            </div>
            <div class="sunglass">
            
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
      </div>
    </div>
    <section top-pad="true" bot-pad="true">
    <div class="sect_container popup"></div>
    </section>
  </div>`;

  $(".chart-main").append(output);
}

function getCardHeader(
  title,
  id,
  parentId = "#accordion",
  childId,
  collapsed = "collapsed"
) {
  // return `<div class="chartHeader" role="" id="heading${id}">
  //         <span class="accordion-menu">
  //         <a
  //         role="button"
  //         is-for=${id}
  //         data-toggle="collapse"
  //         data-parent="#${parentId}"
  //         href="#${childId}"
  //         aria-expanded="false"
  //         aria-controls="${childId}"
  //         class="sec-link ${collapsed}"
  //         >
  //         ${translate(title) }
  //         </a>
  //     </span>
  //     </div>`
  return `<button
    role="button"
    is-for=${id}
    data-toggle="collapse"
    data-parent="#${parentId}"
    href="#${childId}"
    aria-expanded="false"
    aria-controls="${childId}"
    class="chartHeader ${collapsed}"
    >
    ${translate(title)}
    </button>`;
}

//creates a radio menu with the given inputs. This is mostyl applied for the main menu
//if the trigger donwload flag is set all radio buttons get the class "triggerDownload", resulting in the
//calling of the function getChartData when the button is clicked
function createRadioMenue(
  _title,
  _checkboxes,
  _checkboxName,
  _checked,
  _titleLevel = "h2",
  _triggerDownload = false,
  _collapseTitle = null,
  _showPowerPlantPlaces = false
) {
  // Remove empty spaces so the collapse can work (fixed bug in "Blockscharfe Erzeugung")
  if (_collapseTitle === null) _collapseTitle = _title.split(" ").join("");

  let output = ``;
  let checked = "";

  if (_title != "") {
    if (_titleLevel == "h2") {
      let title = translate(_title) || "";
      output += getCardHeader(
        title,
        _title.split(" ").join(""),
        "accordion",
        `collapse${_collapseTitle}`
      );
      output += `<div id="collapse${_collapseTitle}" class="collapse"  aria-labelledby="heading${_collapseTitle}">
          <div class='collapseBody'>
          `;
    } else {
      output += `<div id="collapse${_collapseTitle}" class="collapse"  aria-labelledby="heading${_collapseTitle}">
            <div class='collapseBody'>
            <div class='h3TitleRow'>${translate(_title)}</div>`;
    }
  } else {
    output += `<div id="collapse${_collapseTitle}" class="collapse"  aria-labelledby="heading${_collapseTitle}">
        <div class='collapseBody'>`;
  }

  output += "<div class='row'>";

  var radioClass = "";
  if (_triggerDownload == true) {
    radioClass = "triggerDownload";
  }

  for (let id in _checkboxes) {
    let checkbox = _checkboxes[id];
    if (_checked == checkbox["name"]) checked = "checked";
    let value =
      typeof checkbox["value"] != "undefined"
        ? checkbox["value"]
        : checkbox["name"];

    output += `<label class="col-12" for="${checkbox["name"]}">
        <div class="radioContainer">
            <input ${checked} type="radio" id="${
      checkbox["name"]
    }" name="${_checkboxName}" value="${value}" class="${radioClass}" />
            <p class='radioLabel'>${translate(checkbox["title"])}</p>
        </div>
    </label>`;
    checked = "";
  }

  if (_showPowerPlantPlaces) {
    output += `<div class='powerPlantPlaceContainer'>
        <a class="btn btn-outline-primary"  id='powerPlantPlaces' role="button" target='_blank' href='/energy-charts-new/map/map.htm'>${translate(
          "Kraftwerksstandorte"
        )}</a></div>`;
  }

  output += "</div></div></div>";

  return output;
}

//creates a menu, which lists production and block-sharp production underneath each other in a bootstrap toggle, unified under the given _title name
function createTwoLevelEnergySourceMenue(_firstRadioMenuButtons, _title) {
  let title = translate(_title);
  let output = getCardHeader(title, _title, "accordion", `collapse${_title}`);
  output += createRadioMenue(
    "Erzeugung",
    _firstRadioMenuButtons,
    "source",
    "all",
    "h3",
    true,
    _title
  );
  output += createEnergySourceMenue(
    "Blockscharfe Erzeugung",
    [],
    "h3",
    null,
    "hydro_water_reservoir_unit",
    true,
    _title
  );
  output += "</div>";
  return output;
}

//creates a checkbox menu with the given inputs. This is mostyl applied for the main menu
//if the trigger donwload flag is set all radio buttons get the class "triggerDownload", resulting in the
//calling of the function getChartData when the button is clicked
function createInputMenu(
  _title,
  _checkboxes,
  _checkboxName,
  _checked,
  _titleLevel = "h2",
  _triggerDownload = false,
  _collapseTitle
) {
  // let output = "<div class=\"panel panel-default panelPowerPlants\">";
  let output = "";
  let checked = "";
  let title = translate(_title);
  if (_collapseTitle === null) _collapseTitle = _title.split(" ").join("");

  if (_title != "") {
    if (_titleLevel == "h2") {
      output += getCardHeader(
        title,
        _title,
        "accordion",
        `collapse${_collapseTitle}`
      );
      output += `<div id="collapse${_collapseTitle}" class="collapse"  aria-labelledby="heading${_collapseTitle}">
            <div class='collapseBody'>
            `;
    } else {
      output += `<div id="collapse${_collapseTitle}" class="collapse"  aria-labelledby="heading${_collapseTitle}">
            <div class='collapseBody'>
            <div class='h3TitleRow'>${translate(_title)}</div>`;
    }
  } else {
    output += `<div id="collapse${_collapseTitle}" class="collapse"  aria-labelledby="heading${_collapseTitle}">
        <div class='collapseBody'>`;
  }

  var radioClass = "";
  if (_triggerDownload) {
    radioClass = "triggerDownload";
  }

  for (let id in _checkboxes) {
    let checkbox = _checkboxes[id];
    if (_checked === checkbox["name"]) checked = "checked";
    let value =
      typeof checkbox["value"] != "undefined"
        ? checkbox["value"]
        : checkbox["name"];

    let bootstrapClasses = "col-md-12 col-lg-6";
    if (_checkboxes[id]["span"] === 2) bootstrapClasses = "col-md-12 col-lg-12";

    output += `<label class="col-12 p-0" for="${checkbox["name"]}"><div class="${bootstrapClasses}">`;

    if (_checkboxes[id]["type"] === "radio") {
      output += `<div class=" radioContainer">
                    <input ${checked} type="radio" id="${
        checkbox["name"]
      }" name="${_checkboxName}" value="${value}" class="${radioClass}" />
                    <p class='radioLabel'>${translate(checkbox["title"])}</p>
                    </div>`;
    } else if (
      _checkboxes[id]["type"] === "select" ||
      _checkboxes[id]["type"] === "select2"
    ) {
      output += `<div class='row'>
            <p class="">${translate(_checkboxes[id]["title"])}</p>
            `;

      let select2class =
        _checkboxes[id]["type"] === "select2" ? " select2 " : "";
      output += `<select id="${checkbox["name"]}" name="${checkbox["name"]}" value="${value}" 
            class="${select2class} ${radioClass} custom-select-sm">`;

      if (_checkboxes[id]["type"] == "select") {
        for (let option in _checkboxes[id]["options"]) {
          output += `<option value="${
            _checkboxes[id]["options"][option]["value"]
          }">${translate(
            _checkboxes[id]["options"][option]["title"]
          )}</option>"`;
        }
      } else {
        createSelect2OptionList(
          checkbox["optionsURL"],
          checkbox["name"],
          checkbox["select2Keys"],
          checkbox["checked"]
        );
      }

      output += "</select></div>";
    }

    output += "</label>";
    checked = "";
  }

  output += "</div></div>";

  return output;
}

//for the select2 field, a select box with a built-in search field, data are downloaded here to be displayed as options
function createSelect2OptionList(_url, _id, _keys, _selected = null) {
  $.getJSON(_url, function () {}).done(function (data) {
    //fill with data from json
    $.each(data, function (i, item) {
      let text =
        typeof item[_keys[1]] == "object"
          ? item[_keys[1]][0][window.lang]
          : item[_keys[1]];
      let selected = item["StationID"] == _selected;
      $("#" + _id).append(
        $("<option>", {
          value: item[_keys[0]],
          text: text,
          selected: selected,
        })
      );
    });
  });
}

//creates a checkbox menu with the given inputs. This is mostly applied for the main menu
function createCheckboxMenue(
  _title,
  _checkboxes,
  _checkboxName,
  _checked,
  _titleLevel = "h2"
) {
  let output = "";
  let checked = "";

  if (_title != "") {
    if (_titleLevel == "h2") {
      output += getCardHeader(
        translate(_title),
        _title,
        "accordion",
        `collapse${_title}`
      );
    } else {
      output += "<p>" + _title + "</p>";
    }
  } else {
    output += "<br>";
  }

  output += `<div id="collapse${_title}" class="collapse"  aria-labelledby="heading${_title}">
    <div class='collapseBody'>
    <div class='row'>
    `;

  for (let id in _checkboxes) {
    let checkbox = _checkboxes[id];
    if (_checked == checkbox["name"]) checked = "checked";
    let value =
      typeof checkbox["value"] != "undefined"
        ? checkbox["value"]
        : checkbox["name"];

    output += `<label class="col-md-12 radioContainer" for="${
      checkbox["name"]
    }">
        <input ${checked} type="checkbox" id="${checkbox["name"]}" name="${
      checkbox["name"]
    }" value="${value}" />
        <p class='radioLabel'>${translate(checkbox["title"])}</p>
        </label>
        </div>`;
    checked = "";
  }

  output += "</div></div>";
  return output;
}

//appends two bootstrap collapse sections, containing the Description and Hints
function createMenueFooter() {
  try {
    //this method is called after all select2s have been appended, so realize this filed here
    $(".select2").select2({ dropdownAutoWidth: true });
  } catch {
    //do nothing
  }

  //append description section
  let output = getCardHeader(
    translate("Beschreibung"),
    "Description",
    "accordion",
    `collapseDescription`
  );
  output += `<div id="collapseDescription" class="collapse"  aria-labelledby="collapseDescription">
       <div class='collapseBody'>
        <p class='pureTextRow'>${translate(
          "Keine Beschreibung verf&uuml;gbar"
        )}</p> </div></div>`;
  output += createCustomExportingMenue();

  //append advices section
  output += getCardHeader(
    translate("Hinweise"),
    "Advices",
    "accordion",
    `collapseAdvices`
  );
  output += `<div id="collapseAdvices" class="collapse"  aria-labelledby="collapseAdvices">
    <div class='collapseBody'>
        <div><p class='pureTextRow'>${translate(
          "Fahren Sie mit der Maus &uuml;ber die Grafik, um die Zahlenwerte anzuzeigen"
        )}</p></div>
        <div><p class='pureTextRow'>${translate(
          "Ein einfacher Klick auf ein Element der Legende blendet die Quelle ein oder aus"
        )}</p></div> 
        </div></div>`;
  return output;
}

//appends the bootstrap collpase, which contains printing, exporting and social media functions
function createCustomExportingMenue() {
  // let output = "<div class=\"panel panel-default panelPowerPlants\">";
  //
  // output += "<div class=\"panel-heading\" role=\"tab\" id=\"headingPowerPlants\">\n" +
  //     "                            <h4 class=\"panel-title\">\n" +
  //     "                                <a role=\"button\" data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapseExport\" aria-expanded=\"true\" aria-controls=\"collapseExport\" class=\"\">\n" +
  //     `                                    <p>${translate("Exportieren")}</p>` +
  //     "                                </a>\n" +
  //     "                            </h4>\n" +
  //     "                        </div>";
  //
  // output += "<div id=\"collapseExport\" class=\"panel-collapse collapse show\" role=\"tabpanel\" aria-labelledby=\"headingExport\" style=\"\">\n" +
  //     "                            <div class=\"panel-body\">";
  // output += "<ul class='exportMenu'>";
  // output += "<li><button id='printDiagram'>"+translate("Diagramm drucken")+"</button></li>";
  // output += "<li><button id='downloadPNG'>"+translate("Als PNG herunterladen")+"</button></li>";
  // output += "<li><button id='downloadJPEG'>"+translate("Als JPEG herunterladen")+"</button></li>";
  // output += "<li><button id='downloadPDF'>"+translate("Als PDF herunterladen")+"</button></li>";
  // output += "<li><button id='downloadSVG'>"+translate("Als SVG herunterladen")+"</button></li>";
  // output += "</ul></div></div></div>";

  return "";
}

$(document).ready(function () {
  //setup the functions for the exporting menu
  $("#downloadPDF").on("click", function () {
    charts[sourceURL]["chart"].exportChartLocal({
      type: "application/pdf",
      filename:
        "energy-charts_" +
        charts[sourceURL]["name"][lang].replace(new RegExp(" ", "g"), "_"),
    });
  });

  $("#downloadPNG").on("click", function () {
    charts[sourceURL]["chart"].exportChartLocal({
      type: "image/png",
      filename:
        "energy-charts_" +
        charts[sourceURL]["name"][lang].replace(new RegExp(" ", "g"), "_"),
    });
  });

  $("#downloadJPEG").on("click", function () {
    charts[sourceURL]["chart"].exportChartLocal({
      type: "image/jpeg",
      filename:
        "energy-charts_" +
        charts[sourceURL]["name"][lang].replace(new RegExp(" ", "g"), "_"),
    });
  });

  $("#downloadSVG").on("click", function () {
    charts[sourceURL]["chart"].exportChartLocal({
      type: "image/svg",
      filename:
        "energy-charts_" +
        charts[sourceURL]["name"][lang].replace(new RegExp(" ", "g"), "_"),
    });
  });

  $("#printDiagram").on("click", function () {
    charts[sourceURL]["chart"].print();
  });
});
