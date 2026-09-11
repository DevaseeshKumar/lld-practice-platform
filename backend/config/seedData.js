const Problem = require('../models/Problem');

const initialProblems = [
  {
    slug: 'vending-machine',
    title: 'Design a Vending Machine',
    difficulty: 'Medium',
    description: 'Design a low-level object-oriented software system for an automated Vending Machine that dispenses snacks and beverages, handles payment in coins/cash, manages inventory, and gracefully handles edge cases.',
    context: 'The vending machine operates autonomously in a high-traffic public space. It must manage different internal operational states (Idle, HasMoney, Dispensing, OutOfStock, Maintenance), accurately dispense products and calculate change, and prevent illegal operations.',
    requirements: [
      'Support multiple product types with code, price, and current stock quantity.',
      'Accept currency (coins and cash notes) of standard denominations.',
      'Maintain an internal operational state machine (Idle, AwaitingMoney, Dispensing, CoinReturn).',
      'Dispense selected item if inserted money is greater than or equal to product price.',
      'Calculate and return exact change to the user, or refund full amount if transaction is cancelled.',
      'Prevent dispensing when item is out of stock or machine cannot provide exact change.'
    ],
    scenarios: [
      'User inserts $2.00 for a $1.50 soda; system dispenses soda and returns $0.50 change.',
      'User selects an out-of-stock snack; system displays an error and preserves inserted balance.',
      'User presses cancel button after inserting money; machine refunds full amount in the return tray.'
    ],
    constraints: [
      'Must follow Object-Oriented principles (SRP, OCP).',
      'Must explicitly define state transitions using an appropriate design pattern (e.g. State Pattern).',
      'Inventory count must be updated atomically when dispensing succeeds.'
    ],
    rubricCriteria: [
      {
        name: 'Domain Entity Modeling',
        description: 'Identification of core classes such as VendingMachine, Product, Inventory, Coin/Note, Dispenser, and CoinTray.',
        weight: 0.25,
        evaluationType: 'deterministic',
        keywords: ['VendingMachine', 'Product', 'Inventory', 'Coin', 'Note', 'Dispenser', 'Money', 'Item'],
        guidance: 'Identify clear domain entities for the machine, items/products, inventory storage, and payment currency.'
      },
      {
        name: 'State & Lifecycle Management',
        description: 'Modeling states (IdleState, HasMoneyState, DispensingState, SoldOutState) avoiding massive if-else or switch statements.',
        weight: 0.30,
        evaluationType: 'deterministic',
        keywords: ['State', 'Idle', 'Dispensing', 'HasMoney', 'SoldOut', 'Transition', 'VendingState'],
        guidance: 'Apply the State design pattern to represent discrete states and encapsulate state-specific behaviors.'
      },
      {
        name: 'Payment & Change Calculation',
        description: 'Handling balance accumulation, price deduction, and coin return logic.',
        weight: 0.25,
        evaluationType: 'deterministic',
        keywords: ['payment', 'balance', 'change', 'refund', 'denomination', 'calculateChange'],
        guidance: 'Demonstrate accurate balance tracking, change computation, and currency reservoir updates.'
      },
      {
        name: 'Edge Cases & Robustness',
        description: 'Handling out of stock, insufficient funds, machine out of change, and transaction cancellation.',
        weight: 0.20,
        evaluationType: 'ai',
        keywords: ['out of stock', 'insufficient', 'cancel', 'refund', 'exact change', 'concurrency', 'empty'],
        guidance: 'Detail behavior for insufficient funds, cancellation mid-transaction, and out-of-inventory states.'
      }
    ]
  },
  {
    slug: 'parking-lot',
    title: 'Design a Multi-Floor Parking Lot',
    difficulty: 'Medium',
    description: 'Design a low-level object-oriented system for a multi-level automated parking garage that manages parking spots for different vehicle types, issues parking tickets, and calculates parking fees upon exit.',
    context: 'The parking lot consists of multiple floors with varying spot sizes (Motorcycle, Compact/Car, Large/Truck/Bus, Electric). The system must assign the nearest optimal spot upon entry and calculate charges dynamically based on duration and vehicle type.',
    requirements: [
      'Support multiple vehicle types (Motorcycle, Car, Truck, EV) with corresponding spot compatibility.',
      'Organize parking spots across multiple floors, tracking occupied and available spots per floor.',
      'Generate a unique ParkingTicket at entry recording timestamp, spot identifier, and vehicle details.',
      'Assign spots using an extensible strategy (e.g. NearestSpotStrategy, BestFitStrategy).',
      'Calculate parking fees upon exit based on duration and vehicle rate table.',
      'Display real-time availability boards at the entrance and each floor.'
    ],
    scenarios: [
      'Car enters gate 1; system assigns Floor 1 Spot C-12, prints ticket #T101, and lowers available car spots.',
      'Motorcycle enters when compact spots are full but motorcycle spots remain; assignment succeeds.',
      'Truck arrives when all large spots are occupied; entrance gate rejects entry and displays "LOT FULL".',
      'Customer presents ticket after 2 hours 15 minutes; fee calculator computes charge, processes payment, and frees spot.'
    ],
    constraints: [
      'Clear separation of Spot, Vehicle, Ticket, and Fee Calculation responsibilities.',
      'Support concurrent vehicle entry and exit without double-booking spots (Thread safety).',
      'Spot assignment strategy must be open for extension without modifying core parking lot manager.'
    ],
    rubricCriteria: [
      {
        name: 'Class Hierarchy & Spot Compatibility',
        description: 'Clean modeling of Vehicle hierarchy (Car, Bike, Truck) and Spot types (Compact, Large, Motorcycle) with proper polymorphism.',
        weight: 0.25,
        evaluationType: 'deterministic',
        keywords: ['Vehicle', 'Car', 'Motorcycle', 'Truck', 'ParkingSpot', 'CompactSpot', 'LargeSpot', 'Floor'],
        guidance: 'Use inheritance or interfaces for vehicles and spots with clear compatibility check methods.'
      },
      {
        name: 'Spot Assignment Strategy (OCP)',
        description: 'Decoupling the allocation logic into a Strategy pattern (e.g., NearestFirst, FloorBalanced).',
        weight: 0.25,
        evaluationType: 'deterministic',
        keywords: ['Strategy', 'ParkingStrategy', 'NearestFirst', 'assignSpot', 'findSpot', 'allocate'],
        guidance: 'Employ the Strategy Pattern so parking allocation algorithms can be changed without altering core lot logic.'
      },
      {
        name: 'Ticket Lifecycle & Fee Calculation',
        description: 'Immutable ParkingTicket generation at entry, duration tracking, and rate calculation upon exit.',
        weight: 0.25,
        evaluationType: 'deterministic',
        keywords: ['Ticket', 'ParkingTicket', 'FeeCalculator', 'entryTime', 'exitTime', 'rate', 'duration', 'Payment'],
        guidance: 'Model ParkingTicket with entry/exit timestamps and separate fee calculation logic.'
      },
      {
        name: 'Concurrency & Edge Cases',
        description: 'Handling simultaneous arrivals at multiple entry gates, full lot handling, and lost tickets.',
        weight: 0.25,
        evaluationType: 'ai',
        keywords: ['concurrency', 'synchronized', 'lock', 'full lot', 'thread safe', 'race condition', 'lost ticket'],
        guidance: 'Address race conditions when multiple cars enter concurrently aiming for the last remaining spot.'
      }
    ]
  }
];

/**
 * Seeds the database with initial LLD problems if not already present.
 */
async function seedDatabase() {
  for (const prob of initialProblems) {
    const existing = await Problem.findOne({ slug: prob.slug });
    if (!existing) {
      await Problem.create(prob);
      console.log(`[Seed] Created problem: ${prob.title} (${prob.slug})`);
    } else {
      // Keep existing up to date with rubricCriteria & requirements
      existing.title = prob.title;
      existing.difficulty = prob.difficulty;
      existing.description = prob.description;
      existing.context = prob.context;
      existing.requirements = prob.requirements;
      existing.scenarios = prob.scenarios;
      existing.constraints = prob.constraints;
      existing.rubricCriteria = prob.rubricCriteria;
      await existing.save();
      console.log(`[Seed] Updated problem: ${prob.title} (${prob.slug})`);
    }
  }
}

module.exports = {
  initialProblems,
  seedDatabase
};
