
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

--Insert new workflow step for Inactive
insert into wfstep (id, fk,wf_id,name,notes,isfirst,isapproval,modified) values (6,2,'Inactive','','','','2018-10-05 17:19:04');

insert into wfstepnext (id, fk_wfstep_id, fk_step_id_next, sort, notes, modified) values (12,1,6,,,'2018-10-05 17:19:40');
insert into wfstepnext (id, fk_wfstep_id, fk_step_id_next, sort, notes, modified) values (13,2,6,,,'2018-10-05 17:19:40');
insert into wfstepnext (id, fk_wfstep_id, fk_step_id_next, sort, notes, modified) values (14,3,6,,,'2018-10-05 17:19:40');
insert into wfstepnext (id, fk_wfstep_id, fk_step_id_next, sort, notes, modified) values (15,4,6,,,'2018-10-05 17:19:40');
insert into wfstepnext (id, fk_wfstep_id, fk_step_id_next, sort, notes, modified) values (16,6,1,,,'2018-10-05 17:19:40');



