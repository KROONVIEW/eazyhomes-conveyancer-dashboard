const transfers = [
  {
    file: 'EZT1001', property: '12 Main Rd', buyer: 'Alice Smith', seller: 'Bob Jones', type: 'Freehold', stage: 'In Progress', due: '2024-06-10', assigned: 'Eddie',
  },
  {
    file: 'EZT1002', property: '34 Oak Ave', buyer: 'Carol White', seller: 'Dan Black', type: 'Sectional', stage: 'Lodged', due: '2024-06-15', assigned: 'Alexey',
  },
  {
    file: 'EZT1003', property: '18 Pine St', buyer: 'Elena Grey', seller: 'Thomas Brown', type: 'Freehold', stage: 'Awaiting OTP', due: '2024-06-09', assigned: 'Lauren',
  },
  {
    file: 'EZT1004', property: '56 Maple Dr', buyer: 'Nina West', seller: 'Kyle Reed', type: 'Sectional', stage: 'Bond Registration', due: '2024-06-12', assigned: 'John',
  },
  {
    file: 'EZT1005', property: '9 Grove Ln', buyer: 'Ravi Patel', seller: 'Zama Khumalo', type: 'Freehold', stage: 'Clearance Certificate', due: '2024-06-17', assigned: 'Maya',
  },
  {
    file: 'EZT1006', property: '22 Forest Walk', buyer: 'Chen Liu', seller: 'Elsa Dlamini', type: 'Sectional', stage: 'Signed by All Parties', due: '2024-06-18', assigned: 'Sam',
  },
  {
    file: 'EZT1007', property: '78 Cedar Ave', buyer: 'John Kim', seller: 'Lerato Mokoena', type: 'Freehold', stage: 'Final Review', due: '2024-06-19', assigned: 'Chloe',
  },
  {
    file: 'EZT1008', property: '41 Birch Blvd', buyer: 'Sara Naidoo', seller: 'Mandla Hlophe', type: 'Sectional', stage: 'Lodgement Ready', due: '2024-06-21', assigned: 'Zach',
  },
  {
    file: 'EZT1009', property: '15 Hilltop Way', buyer: 'Amira Abbas', seller: 'George Evans', type: 'Freehold', stage: 'Prep Deeds Office', due: '2024-06-23', assigned: 'Joan',
  },
  {
    file: 'EZT1010', property: '73 Riverbank Rd', buyer: 'Pedro Alves', seller: 'Karabo Sithole', type: 'Sectional', stage: 'Bond Cancelled', due: '2024-06-24', assigned: 'Tumi',
  },
  // 30 more, rotating data
  {
    file: 'EZT1011', property: '88 Willow St', buyer: 'Megan Fox', seller: 'Sam Lee', type: 'Freehold', stage: 'Lodged', due: '2024-06-25', assigned: 'Eddie',
  },
  {
    file: 'EZT1012', property: '19 Oakridge Ave', buyer: 'Liam Smith', seller: 'Priya Singh', type: 'Sectional', stage: 'In Progress', due: '2024-06-26', assigned: 'Alexey',
  },
  {
    file: 'EZT1013', property: '7 Aspen Close', buyer: 'Olivia Brown', seller: 'Noah White', type: 'Freehold', stage: 'Awaiting OTP', due: '2024-06-27', assigned: 'Lauren',
  },
  {
    file: 'EZT1014', property: '23 Maple Grove', buyer: 'Lucas Green', seller: 'Emma Black', type: 'Sectional', stage: 'Bond Registration', due: '2024-06-28', assigned: 'John',
  },
  {
    file: 'EZT1015', property: '5 Cedar Lane', buyer: 'Sophia Patel', seller: 'Mason Khumalo', type: 'Freehold', stage: 'Clearance Certificate', due: '2024-06-29', assigned: 'Maya',
  },
  {
    file: 'EZT1016', property: '31 Forest Walk', buyer: 'Ethan Liu', seller: 'Ava Dlamini', type: 'Sectional', stage: 'Signed by All Parties', due: '2024-06-30', assigned: 'Sam',
  },
  {
    file: 'EZT1017', property: '99 Cedar Ave', buyer: 'Mia Kim', seller: 'Jacob Mokoena', type: 'Freehold', stage: 'Final Review', due: '2024-07-01', assigned: 'Chloe',
  },
  {
    file: 'EZT1018', property: '42 Birch Blvd', buyer: 'Ella Naidoo', seller: 'Logan Hlophe', type: 'Sectional', stage: 'Lodgement Ready', due: '2024-07-02', assigned: 'Zach',
  },
  {
    file: 'EZT1019', property: '16 Hilltop Way', buyer: 'Zara Abbas', seller: 'Henry Evans', type: 'Freehold', stage: 'Prep Deeds Office', due: '2024-07-03', assigned: 'Joan',
  },
  {
    file: 'EZT1020', property: '74 Riverbank Rd', buyer: 'Diego Alves', seller: 'Nia Sithole', type: 'Sectional', stage: 'Bond Cancelled', due: '2024-07-04', assigned: 'Tumi',
  },
  {
    file: 'EZT1021', property: '11 Main Rd', buyer: 'Ava Smith', seller: 'Ben Jones', type: 'Freehold', stage: 'In Progress', due: '2024-07-05', assigned: 'Eddie',
  },
  {
    file: 'EZT1022', property: '35 Oak Ave', buyer: 'Cora White', seller: 'Dan Grey', type: 'Sectional', stage: 'Lodged', due: '2024-07-06', assigned: 'Alexey',
  },
  {
    file: 'EZT1023', property: '19 Pine St', buyer: 'Elena Black', seller: 'Tom Brown', type: 'Freehold', stage: 'Awaiting OTP', due: '2024-07-07', assigned: 'Lauren',
  },
  {
    file: 'EZT1024', property: '57 Maple Dr', buyer: 'Nina East', seller: 'Kyle Blue', type: 'Sectional', stage: 'Bond Registration', due: '2024-07-08', assigned: 'John',
  },
  {
    file: 'EZT1025', property: '10 Grove Ln', buyer: 'Ravi Singh', seller: 'Zama Patel', type: 'Freehold', stage: 'Clearance Certificate', due: '2024-07-09', assigned: 'Maya',
  },
  {
    file: 'EZT1026', property: '23 Forest Walk', buyer: 'Chen Zhang', seller: 'Elsa Mthembu', type: 'Sectional', stage: 'Signed by All Parties', due: '2024-07-10', assigned: 'Sam',
  },
  {
    file: 'EZT1027', property: '79 Cedar Ave', buyer: 'John Lee', seller: 'Lerato Nkosi', type: 'Freehold', stage: 'Final Review', due: '2024-07-11', assigned: 'Chloe',
  },
  {
    file: 'EZT1028', property: '43 Birch Blvd', buyer: 'Sara Moodley', seller: 'Mandla Ndlovu', type: 'Sectional', stage: 'Lodgement Ready', due: '2024-07-12', assigned: 'Zach',
  },
  {
    file: 'EZT1029', property: '17 Hilltop Way', buyer: 'Amira Khan', seller: 'George Smith', type: 'Freehold', stage: 'Prep Deeds Office', due: '2024-07-13', assigned: 'Joan',
  },
  {
    file: 'EZT1030', property: '75 Riverbank Rd', buyer: 'Pedro Costa', seller: 'Karabo Mokoena', type: 'Sectional', stage: 'Bond Cancelled', due: '2024-07-14', assigned: 'Tumi',
  },
  {
    file: 'EZT1031', property: '89 Willow St', buyer: 'Megan Lee', seller: 'Sam Fox', type: 'Freehold', stage: 'Lodged', due: '2024-07-15', assigned: 'Eddie',
  },
  {
    file: 'EZT1032', property: '20 Oakridge Ave', buyer: 'Liam Brown', seller: 'Priya White', type: 'Sectional', stage: 'In Progress', due: '2024-07-16', assigned: 'Alexey',
  },
  {
    file: 'EZT1033', property: '8 Aspen Close', buyer: 'Olivia Green', seller: 'Noah Black', type: 'Freehold', stage: 'Awaiting OTP', due: '2024-07-17', assigned: 'Lauren',
  },
  {
    file: 'EZT1034', property: '24 Maple Grove', buyer: 'Lucas White', seller: 'Emma Green', type: 'Sectional', stage: 'Bond Registration', due: '2024-07-18', assigned: 'John',
  },
  {
    file: 'EZT1035', property: '6 Cedar Lane', buyer: 'Sophia Singh', seller: 'Mason Patel', type: 'Freehold', stage: 'Clearance Certificate', due: '2024-07-19', assigned: 'Maya',
  },
  {
    file: 'EZT1036', property: '32 Forest Walk', buyer: 'Ethan Zhang', seller: 'Ava Mthembu', type: 'Sectional', stage: 'Signed by All Parties', due: '2024-07-20', assigned: 'Sam',
  },
  {
    file: 'EZT1037', property: '100 Cedar Ave', buyer: 'Mia Lee', seller: 'Jacob Nkosi', type: 'Freehold', stage: 'Final Review', due: '2024-07-21', assigned: 'Chloe',
  },
  {
    file: 'EZT1038', property: '44 Birch Blvd', buyer: 'Ella Moodley', seller: 'Logan Ndlovu', type: 'Sectional', stage: 'Lodgement Ready', due: '2024-07-22', assigned: 'Zach',
  },
  {
    file: 'EZT1039', property: '18 Hilltop Way', buyer: 'Zara Khan', seller: 'Henry Smith', type: 'Freehold', stage: 'Prep Deeds Office', due: '2024-07-23', assigned: 'Joan',
  },
  {
    file: 'EZT1040', property: '76 Riverbank Rd', buyer: 'Diego Costa', seller: 'Nia Mokoena', type: 'Sectional', stage: 'Bond Cancelled', due: '2024-07-24', assigned: 'Tumi',
  },
  {
    file: 'EZT1041', property: '90 Willow St', buyer: 'Ava Lee', seller: 'Ben Fox', type: 'Freehold', stage: 'Lodged', due: '2024-07-25', assigned: 'Eddie',
  },
  {
    file: 'EZT1042', property: '21 Oakridge Ave', buyer: 'Cora Brown', seller: 'Dan White', type: 'Sectional', stage: 'In Progress', due: '2024-07-26', assigned: 'Alexey',
  },
  {
    file: 'EZT1043', property: '9 Pine St', buyer: 'Elena Black', seller: 'Tom Green', type: 'Freehold', stage: 'Awaiting OTP', due: '2024-07-27', assigned: 'Lauren',
  },
  {
    file: 'EZT1044', property: '58 Maple Dr', buyer: 'Nina South', seller: 'Kyle Red', type: 'Sectional', stage: 'Bond Registration', due: '2024-07-28', assigned: 'John',
  },
  {
    file: 'EZT1045', property: '11 Grove Ln', buyer: 'Ravi Moodley', seller: 'Zama Singh', type: 'Freehold', stage: 'Clearance Certificate', due: '2024-07-29', assigned: 'Maya',
  },
];

export default transfers; 