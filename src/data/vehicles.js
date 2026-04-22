export const vehicleYears = Array.from(
  { length: new Date().getFullYear() - 1989 },
  (_, index) => String(new Date().getFullYear() - index),
)

export const makeModels = {
  Acura: ['ILX', 'Integra', 'MDX', 'RDX', 'TLX'],
  Audi: ['A3', 'A4', 'A5', 'A6', 'Q3', 'Q5', 'Q7'],
  BMW: ['2 Series', '3 Series', '4 Series', '5 Series', 'X1', 'X3', 'X5'],
  Chevrolet: ['Camaro', 'Colorado', 'Corvette', 'Equinox', 'Malibu', 'Silverado', 'Suburban', 'Tahoe', 'Traverse'],
  Dodge: ['Challenger', 'Charger', 'Durango', 'Grand Caravan'],
  Ford: ['Bronco', 'Edge', 'Escape', 'Explorer', 'F-150', 'Focus', 'Fusion', 'Mustang', 'Ranger'],
  GMC: ['Acadia', 'Canyon', 'Sierra', 'Terrain', 'Yukon'],
  Honda: ['Accord', 'Civic', 'CR-V', 'Fit', 'HR-V', 'Odyssey', 'Passport', 'Pilot', 'Ridgeline'],
  Hyundai: ['Elantra', 'Kona', 'Palisade', 'Santa Fe', 'Sonata', 'Tucson', 'Venue'],
  Jeep: ['Cherokee', 'Compass', 'Gladiator', 'Grand Cherokee', 'Renegade', 'Wrangler'],
  Kia: ['Forte', 'K5', 'Seltos', 'Sorento', 'Soul', 'Sportage', 'Telluride'],
  Lexus: ['ES', 'GX', 'IS', 'LS', 'NX', 'RX', 'UX'],
  Mazda: ['CX-3', 'CX-30', 'CX-5', 'CX-9', 'Mazda3', 'Mazda6', 'MX-5 Miata'],
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'GLA', 'GLC', 'GLE', 'S-Class'],
  Nissan: ['Altima', 'Frontier', 'Maxima', 'Murano', 'Pathfinder', 'Rogue', 'Sentra', 'Titan', 'Versa'],
  Porsche: ['911', 'Boxster', 'Cayenne', 'Cayman', 'Macan', 'Panamera', 'Taycan'],
  Ram: ['1500', '2500', '3500', 'ProMaster'],
  Subaru: ['Ascent', 'BRZ', 'Crosstrek', 'Forester', 'Impreza', 'Legacy', 'Outback', 'WRX'],
  Tesla: ['Model 3', 'Model S', 'Model X', 'Model Y'],
  Toyota: ['4Runner', 'Camry', 'Corolla', 'Highlander', 'Prius', 'RAV4', 'Sienna', 'Tacoma', 'Tundra'],
  Volkswagen: ['Atlas', 'Golf', 'Jetta', 'Passat', 'Taos', 'Tiguan'],
}
