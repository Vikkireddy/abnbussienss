CREATE TABLE abn (
  abn VARCHAR(11) PRIMARY KEY,
  status VARCHAR(50),
  status_date DATE,
  entity_type VARCHAR(100)
);

CREATE TABLE business_name (
  id INT AUTO_INCREMENT PRIMARY KEY,
  abn VARCHAR(11),
  name VARCHAR(255),
  FOREIGN KEY (abn) REFERENCES abn(abn)
);

CREATE TABLE address (
  id INT AUTO_INCREMENT PRIMARY KEY,
  abn VARCHAR(11),
  state VARCHAR(10),
  postcode VARCHAR(10),
  FOREIGN KEY (abn) REFERENCES abn(abn)
);