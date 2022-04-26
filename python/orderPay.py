from dataclasses import dataclass, field


@dataclass
class Order:
    items: list = field(default_factory=list)
    quantities: list = field(default_factory=list)
    prices: list = field(default_factory=list)
    status: str = "open"

    def add_item(self, name, quantity, price):
        self.items.append(name)
        self.quantities.append(quantity)
        self.prices.append(price)

    def total_price(self):
        total = 0
        for i in range(len(self.prices)):
            total += self.quantities[i] * self.prices[i]
        return total


order = Order()
order.add_item("Keyboard", 1, 50)
order.add_item("SSD", 2, 150)
order.add_item("USB Cable", 1, 5.5)

print(order.total_price())
