use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    let my_age = rand::thread_rng().gen_range(1, 101);
    println!("My first Rust Program");

    let mut name = String::new();
    println!("What's your name?");
    io::stdin()
        .read_line(&mut name)
        .expect("failed to read line");
    println!("Welcome to my program {}", name);

    loop {
        println!("Can you guess my age?");
        let mut guess = String::new();
        io::stdin()
            .read_line(&mut guess)
            .expect("failed to read line");
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };
        println!("You guessed: {}", guess);
        match guess.cmp(&my_age) {
            Ordering::Less => println!("Too small, my age is {}", my_age),
            Ordering::Greater => println!("Too big, my age is {}", my_age),
            Ordering::Equal => {
                println!("Correct!");
                break;
            }
        }
    }
}
