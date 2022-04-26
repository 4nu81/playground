import shlex
from dataclasses import dataclass
from typing import List


def run_command(command: str) -> None:
    match command:
        case "quit":
            print("Quitting the program.")
            quit()
        case "reset":
            print("resetting System")
        case other:
            print(f"Unnokwn command {command!r}.")


def run_command_v2(command: str) -> None:
    match command.split():
        case ["load", filename]:
            print(f"loading file: {filename}.")
        case ["save", filename]:
            print(f"saving file: {filename}.")
        case ["quit" | "exit" | "bye", *rest]:
            if "--force" in rest or "-f" in rest:
                print("sending SIGTERM to all processes and quitting the program")
            else:
                print("quitting the program")
            quit()
        case _:
            print(f"Unnokwn command {command!r}.")


def run_command_v3(command: str) -> None:
    match command.split():
        case ["load", filename]:
            print(f"loading file: {filename}.")
        case ["save", filename]:
            print(f"saving file: {filename}.")
        case ["quit" | "exit" | "bye", *rest] if "--force" in rest or "-f" in rest:
            print("sending SIGTERM to all processes and quitting the program")
            quit()
        case ["quit" | "exit" | "bye"]:
            print("quitting the program")
            quit()
        case _:
            print(f"Unnokwn command {command!r}.")


@dataclass
class Command:
    """Class that represents a command"""

    command: str
    args: List[str]


def run_command_v4(cmd: Command):
    print(cmd)
    match cmd:
        case Command(command="load", args=[filename]):
            print(f"loading file: {filename}.")
        case Command(command="save", args=[filename]):
            print(f"saving file: {filename}.")
        case Command(command="quit" | "exit" | "bye", args=["--force" | "-f", *rest]):
            print("sending SIGTERM to all processes and quitting the program")
            quit()
        case Command(command="quit" | "exit" | "bye"):
            print("quitting the program")
            quit()
        case _:
            print(f"Unnokwn command {cmd!r}.")


def main() -> None:
    while True:
        # command = input("$ ")

        # for v4:
        # shlex better in parsing args from commandline.
        command, *arguments = shlex.split(input("$ "))

        run_command_v4(Command(command, arguments))


if __name__ == "__main__":
    main()
