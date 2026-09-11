export const SAMPLE_SUBMISSIONS = {
  'vending-machine': {
    comprehensive: {
      requirementsUnderstanding: 'The Vending Machine is an automated self-service station that dispenses snacks and beverages upon payment. It must maintain accurate stock, accept standard currency (coins/notes), track inserted balance, safely transition through operational states, dispense items atomically, and return exact change or full refunds upon cancellation.',
      assumptions: '1. Machine operates in a single concurrent transaction per terminal.\n2. Hardware sensors detect coin insertion and item drop.\n3. Exact change coin reservoir is managed internally.',
      classes: '• VendingMachine: Main controller orchestrating states, inventory, and payment\n• State (interface): Base state with insertMoney(), selectProduct(), dispense(), cancel()\n• IdleState, HasMoneyState, DispensingState, SoldOutState: Concrete state implementations\n• Product: Item entity with id, name, price, category\n• Inventory: Stock management mapping product to current quantities\n• Coin / Note (enum/class): Denomination definitions (0.25, 1.00, 5.00)\n• PaymentProcessor: Manages current balance, change calculation, and refund\n• CoinTray: Hardware interface for returning physical coins',
      responsibilities: '• VendingMachine: Holds references to currentState, Inventory, and PaymentProcessor. Delegates state-specific transitions.\n• States: Guard valid user transitions (e.g. cannot dispense in IdleState, cannot cancel during active Dispensing).\n• Inventory: Decrements stock on confirmed dispense, reports out-of-stock items.\n• PaymentProcessor: Computes exact change using greedy coin denomination algorithm.',
      relationships: '• VendingMachine HAS-A State (State Pattern for lifecycle)\n• VendingMachine HAS-A Inventory (Composition)\n• VendingMachine HAS-A PaymentProcessor (Composition)\n• Inventory AGGREGATES Products\n• Concrete states IMPLEMENT State interface',
      edgeCases: '1. Out of stock item selected: Reject selection, alert user, preserve inserted money.\n2. Insufficient change in coin tray: Alert user, prevent dispensing, refund entire inserted balance.\n3. User presses cancel: Refund full inserted amount immediately and return to IdleState.\n4. Concurrent button presses: Synchronize state transitions to prevent race conditions.'
    },
    minimal: {
      requirementsUnderstanding: 'A machine that dispenses drinks when you put money into it.',
      assumptions: 'None.',
      classes: 'Machine, Drink, Coin.',
      responsibilities: 'Machine does everything including checking stock and taking money.',
      relationships: 'Machine has drinks.',
      edgeCases: 'Item is not there.'
    }
  },
  'parking-lot': {
    comprehensive: {
      requirementsUnderstanding: 'A multi-floor automated parking garage managing spots for diverse vehicle types (Motorcycle, Car, Truck, EV). It generates unique tickets at entry, assigns spots using an optimal strategy, monitors floor availability, and calculates parking fees upon exit based on duration and vehicle rate.',
      assumptions: '1. Fixed number of floors and spots per floor.\n2. Multiple entry and exit gates operating concurrently.\n3. Ticket barcode/QR scanned at exit for payment processing.',
      classes: '• ParkingLot: Singleton coordinator managing floors, gates, and availability\n• ParkingFloor: Represents a level with organized ParkingSpots and display board\n• ParkingSpot (abstract): Base spot with spotId, floor, isAvailable, spotType\n• CompactSpot, LargeSpot, MotorcycleSpot: Concrete specialized spots\n• Vehicle (abstract): licensePlate, vehicleType\n• Car, Truck, Motorcycle, ElectricCar: Concrete vehicle types\n• ParkingTicket: ticketId, vehicleId, spotId, entryTime, exitTime, status\n• ParkingStrategy (interface): Strategy pattern for finding optimal spot (e.g. NearestFirstStrategy)\n• FeeCalculator: Computes charges based on vehicle tier and hours stayed',
      responsibilities: '• ParkingLot: Directs vehicles to entry gates, checks overall capacity.\n• ParkingFloor: Tracks available spot counts per type and updates local display board.\n• ParkingStrategy: Selects the best available spot matching the vehicle type.\n• FeeCalculator: Calculates fee based on duration (e.g., first hour flat, hourly thereafter).\n• ParkingTicket: Immutable record of entry and exit times.',
      relationships: '• ParkingLot HAS-MANY ParkingFloors (Composition)\n• ParkingFloor HAS-MANY ParkingSpots (Composition)\n• ParkingSpot ACCEPTS Vehicle (Association)\n• ParkingLot USES ParkingStrategy (Strategy Pattern)\n• ParkingTicket ASSOCIATES Vehicle and ParkingSpot',
      edgeCases: '1. Concurrency: Multiple vehicles arriving simultaneously at different gates require synchronized/atomic spot allocation to prevent double-booking.\n2. Lot full: Display board shows "FULL" and entry gate remains closed.\n3. Vehicle type mismatch: A truck cannot be assigned a compact spot; a motorcycle can use a compact spot if bike spots are full (with configurable policy).\n4. Lost ticket: Support fixed penalty rate when ticket is lost.'
    },
    minimal: {
      requirementsUnderstanding: 'A place where cars park and pay money when leaving.',
      assumptions: 'Lots of space.',
      classes: 'ParkingLot, Car, Ticket.',
      responsibilities: 'ParkingLot keeps track of parked cars.',
      relationships: 'Cars park in ParkingLot.',
      edgeCases: 'Lot is full.'
    }
  }
};
