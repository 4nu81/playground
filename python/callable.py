from typing import Callable


def use_function(print_smt: Callable[[int, str], str]) -> bool:
    print(print_smt(2, "cool"))
    return True


def print_smt(i: int, s: str) -> str:
    result = f"{i}{s}"
    return result


use_function(lambda i, s: f"{i}{s}")

use_function(print_smt)
