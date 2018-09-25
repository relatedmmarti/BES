/*

.headers on
.mode column
*/

/*
drop table `eftpayee`;
CREATE TABLE `eftpayee` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
	`vendorid` VARCHAR(255),
	`sourcesystem` VARCHAR(255),
	`payeename` VARCHAR(255),
	`payeeaddress` VARCHAR(255),
	`bankname` VARCHAR(255),
	`bankaddress` VARCHAR(255),
	`paytype` VARCHAR(255),
	`routing` VARCHAR(255),
	`account` VARCHAR(255),
	`swift` VARCHAR(255),
	`interbankname` VARCHAR(255),
	`interbankaddress` VARCHAR(255),
	`interrouting` VARCHAR(255),
	`interswift` VARCHAR(255),
	`created` DEFAULT CURRENT_TIMESTAMP,
	`modified` DEFAULT CURRENT_TIMESTAMP,
	`notes` TEXT
);
*/

drop table `eftpayee`;
CREATE TABLE`eftpayee` (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     vendorid VARCHAR(255),
     vendortype VARCHAR(255),
     sourcesystem VARCHAR(255),
     payeename VARCHAR(255),
     payeeaddress VARCHAR(255),
     payeecity VARCHAR(255),
     payeestate VARCHAR(255),
     payeezip VARCHAR(255),
     payeecountry VARCHAR(255),
     bankname VARCHAR(255),
     bankaccountname  VARCHAR(255),
     forfurthercredit  VARCHAR(255),
     bankaddress VARCHAR(255),
     bankcity VARCHAR(255),
     bankstate VARCHAR(255),
     bankzip VARCHAR(255),
     bankcountry VARCHAR(255),
     paytype VARCHAR(255),
     achsec VARCHAR(255),
     routing VARCHAR(255),
     account VARCHAR(255),
     swift VARCHAR(255),
     interbankname VARCHAR(255),
     interbankaddress VARCHAR(255),
     interbankcity VARCHAR(255),
     interbankstate VARCHAR(255),
     interbankzip VARCHAR(255),
     interbankcountry VARCHAR(255),
     interrouting VARCHAR(255),
     interswift VARCHAR(255),
     created DEFAULT CURRENT_TIMESTAMP,
     modified DEFAULT CURRENT_TIMESTAMP,
     notes TEXT
);


drop table `objtype`;
CREATE TABLE `objtype` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
	`name` VARCHAR(255),
	`modified` DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO objtype ('id','name') values (75, 'eftpayee');

drop table `wf`;
CREATE TABLE `wf` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
	`fk_objtype_id` INTEGER,
	`name` VARCHAR(255),
	`modified` DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO wf ('name','fk_objtype_id') values ('Beneficiary EFT Setup', 75);

/*a list of valid steps for the workflow*/
drop table `wfstep`;
CREATE TABLE `wfstep` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
	`fk_wf_id` int,
	`name` VARCHAR(255),
	`notes` VARCHAR(255),
	`isfirst` INTEGER,
	`isapproval` INTEGER,
	`modified` DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO wfstep ('fk_wf_id','name', 'isfirst', 'isapproval') values
(1, 'Entry', 1, null),
(1, 'Review', null, null),
(1, 'Hold', null, null),
(1, 'Reject', null, null),
(1, 'Approved', null, 1);




/*stores the list of valid users who can take action on each wfstep*/
drop table `wfstepusers`;
CREATE TABLE `wfstepusers` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
	`fk_wfstep_id` INTEGER,
	`username` VARCHAR(255),
	`notes` VARCHAR(255),
	`modified` DEFAULT CURRENT_TIMESTAMP
);

insert into `wfstepusers` (`fk_wfstep_id`,`username`) values
 (2,'kweller@relatedgroup.com')
,(2,'jhoyos@relatedgroup.com')
,(2,'sgonzalez@relatedgroup.com')

,(3,'kweller@relatedgroup.com')
,(3,'jhoyos@relatedgroup.com')
,(3,'sgonzalez@relatedgroup.com')

,(5,'kweller@relatedgroup.com')
,(5,'jhoyos@relatedgroup.com')
,(5,'sgonzalez@relatedgroup.com');


/*
select * from wfstep;
1|1|Entry||2018-08-08 18:56:46
2|1|Review||2018-08-08 18:56:46
3|1|Hold||2018-08-08 18:56:46
4|1|Reject||2018-08-08 18:56:46
5|1|Approved||2018-08-08 18:56:46

*/

/*a list of actions eligible for each step*/
drop table `wfstepnext`;
CREATE TABLE `wfstepnext` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
	`fk_wfstep_id` INTEGER,
	`fk_wfstep_id_next` INTEGER,
	`sort` INTEGER,
	`notes` VARCHAR(255),
	`modified` DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO wfstepnext ('fk_wfstep_id','fk_wfstep_id_next') values
/*new records default to entry*/
(null, 1),
/*entry can only send to review*/
(1, 2),
/*review can send to hold reject or approved*/
(2, 3),
(2, 4),
(2, 5),
/*hold can goto approved or reject */
(3, 5),
(3, 4),
/*reject can only goto review*/
(4, 2),
/*approved can only goto the beginning*/
(5, 1);

/*stores the workflow actions selected*/
drop table `wfaction`;
CREATE TABLE `wfaction` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
	`fk_objtype_id` INTEGER,
	`fk_object_id` INTEGER,
	`fk_wfstep_id` INTEGER,
	`username` VARCHAR(255),
	`notes` VARCHAR(255),
	`modified` DEFAULT CURRENT_TIMESTAMP
);



/*roles TBD*/
/*
drop table `roles`;
CREATE TABLE `roles` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
	`name` VARCHAR(255),
	`notes` VARCHAR(255),
	`modified` DEFAULT CURRENT_TIMESTAMP
);
*/


drop table `auditlog`;
CREATE TABLE `auditlog` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
	`action` VARCHAR(255),
	`status` VARCHAR(255),
	`modified` DEFAULT CURRENT_TIMESTAMP,
	`username` VARCHAR(255),
	`payload` TEXT
);



delete from auditlog;
delete from wfaction;
