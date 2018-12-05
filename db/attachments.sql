
drop table `eftattach`;
CREATE TABLE `eftattach`
(
  `id` INTEGER,
  `filename` TEXT,
  `dateadded` TEXT,
  `dateupdated` TEXT,
  `datedeleted` TEXT,
  `user` TEXT,
  PRIMARY KEY(`id`,`filename`)
)