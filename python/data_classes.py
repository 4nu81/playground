import random
import string
from dataclasses import dataclass, field


def generate_id() -> str:
    return "".join(random.choices(string.ascii_letters, k=20))


@dataclass(kw_only=True, slots=True)
class Person:
    name: str
    address: str
    active: bool = True
    email_addresses: list[str] = field(default_factory=list)
    id: str = field(init=False, default_factory=generate_id)
    _search_string: str = field(init=False, repr=False)

    def __post_init__(self):
        self._search_string = f"{self.name} {self.address}"


def main() -> None:
    person = Person(name="John Doe", address="123 Main St")
    person2 = Person(name="Jane Doe", address="124 Main St", active=False)
    print(person)
    print(person2)


if __name__ == "__main__":
    main()
