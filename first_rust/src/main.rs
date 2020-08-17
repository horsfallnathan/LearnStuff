use std::io;

fn main() {
    println!("My first Rust Program");
    println!("What's your name?");
    let mut name = String::new();
    io::stdin()
        .read_line(&mut name)
        .expect("failed to read line");
    println!("Thanks for using my program {}", name)
}
