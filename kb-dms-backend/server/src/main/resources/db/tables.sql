CREATE TABLE `kb-dms`.`user_info`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `account` VARCHAR(256) NOT NULL COMMENT '登录账号',
    `login_pwd` VARCHAR(256) NOT NULL COMMENT '登录密码',
    `name` VARCHAR(256) NOT NULL COMMENT '昵称',
    `create_time` DATETIME NOT NULL COMMENT '创建时间',
    `update_time` DATETIME NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `login_name_UNIQUE` (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户信息表';

CREATE TABLE `kb-dms`.`us_sql_editor_tab`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(1024),
    `db` VARCHAR(256) NOT NULL,
    `datasource_id` INT(11) NOT NULL,
    `sql_text` LONGTEXT,
    `create_time` DATETIME NOT NULL,
    `update_time` DATETIME NOT NULL,
    `creator_account` VARCHAR(256) NOT NULL,
    `creator_name` VARCHAR(256) NOT NULL,
    `table_name` VARCHAR(1024),
    `type` INT(11) NOT NULL DEFAULT '1' COMMENT '1. 查询窗口 2.数据查看窗口 3. 编辑表结构',
    `status` INT(11) NOT NULL DEFAULT '1',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户窗口表';

CREATE TABLE `kb-dms`.`us_favorite_table`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `datasource_id` INT(11) NOT NULL,
    `db` VARCHAR(1024) NOT NULL,
    `table_name` VARCHAR(1024) NOT NULL,
    `account` VARCHAR(1024) NOT NULL,
    `create_time` DATETIME NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户收藏表';


CREATE TABLE `kb-dms`.`us_favorite_group`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `group_id` INT(11) NOT NULL,
    `create_time` DATETIME NOT NULL,
    `account` VARCHAR(1024) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='';

CREATE TABLE `kb-dms`.`us_favorite_db`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `datasource_id` INT(11) NOT NULL,
    `db` VARCHAR(1024) NOT NULL,
    `account` VARCHAR(1024) NOT NULL,
    `create_time` DATETIME NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='';

CREATE TABLE `kb-dms`.`us_favorite_datasource`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `datasource_id` INT(11) NOT NULL,
    `account` VARCHAR(1024) NOT NULL,
    `create_time` DATETIME NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='';


CREATE TABLE `kb-dms`.`us_active_sql_editor_tab`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `account` VARCHAR(256) NOT NULL,
    `create_time` DATETIME NOT NULL,
    `update_time` DATETIME NOT NULL,
    `sql_tab_id` INT(11),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='';

CREATE TABLE `kb-dms`.`st_sql_syntax_error_count_timeline`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `type` INT(11) NOT NULL COMMENT '1. 全部 2. 缺少limit 3. 缺少where 4. 越权',
    `count` INT(11) NOT NULL,
    `create_time` DATETIME NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='';

CREATE TABLE `kb-dms`.`st_sql_syntax_error_count_day`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `type` INT(11) NOT NULL COMMENT '1. 缺少limit 2. 缺少where 3. 越权',
    `count` INT(11) NOT NULL,
    `create_time` DATETIME NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='';

CREATE TABLE `kb-dms`.`st_sql_exe_result_count_timeline`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `type` INT(11) NOT NULL COMMENT '1. 全部 2. 执行成功 3. 执行失败 4. 执行中',
    `count` INT(11) NOT NULL,
    `create_time` DATETIME NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='';

CREATE TABLE `kb-dms`.`st_sql_exe_result_count_day`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `type` INT(11) NOT NULL COMMENT '1. 全部 2. 执行成功 3. 执行失败 4. 执行中',
    `count` INT(11) NOT NULL,
    `create_time` DATETIME NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='';

CREATE TABLE `kb-dms`.`st_sql_exe_biz_total`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `sql_exe_result_total` INT(11) NOT NULL DEFAULT '0',
    `sql_exe_result_success_total` INT(11) NOT NULL DEFAULT '0',
    `sql_exe_result_running_total` INT(11) NOT NULL DEFAULT '0',
    `sql_exe_result_fail_total` INT(11) NOT NULL DEFAULT '0',
    `sql_syntax_no_permission_total` INT(11) NOT NULL DEFAULT '0',
    `sql_syntax_no_limit_total` INT(11) NOT NULL DEFAULT '0',
    `sql_syntax_no_where_total` INT(11) NOT NULL DEFAULT '0',
    `sql_syntax_error_total` INT(11) NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='';

CREATE TABLE `kb-dms`.`rs_sql_exe_result`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `sql_exe_record_id` INT(11) NOT NULL,
    `sql_text` LONGTEXT NOT NULL,
    `result` LONGTEXT,
    `create_time` DATETIME NOT NULL,
    `update_time` DATETIME NOT NULL,
    `status` INT(11) NOT NULL DEFAULT '1' COMMENT '1. 执行中 -1 执行失败 2. 执行成功',
    `syntax_error_type` INT(11),
    `syntax_error_sql` LONGTEXT,
    `creator_name` VARCHAR(256),
    `creator_account` VARCHAR(256),
    `sql_option_type` INT(11),
    `datasource_name` VARCHAR(1024),
    `datasource_type` INT(11),
    `db` VARCHAR(1024),
    `datasource_id` INT(11),
    `group_id` INT(11),
    `group_name` VARCHAR(1024),
    `table_name_list` VARCHAR(4096),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='';

CREATE TABLE `kb-dms`.`rs_sql_exe_record`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `sql_text` LONGTEXT NOT NULL,
    `datasource_id` INT(11) NOT NULL,
    `db` VARCHAR(256) NOT NULL,
    `status` INT(11) NOT NULL DEFAULT '1' COMMENT '1. 执行中  2. 执行完成',
    `create_account` VARCHAR(256) NOT NULL,
    `create_name` VARCHAR(256) NOT NULL,
    `create_time` DATETIME NOT NULL,
    `update_time` DATETIME NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='';

CREATE TABLE `kb-dms`.`cf_datasource_permission_sql_options`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `datasource_id` INT(11) NOT NULL,
    `option_type` INT(11) NOT NULL,
    `account` VARCHAR(256) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='';

CREATE TABLE `kb-dms`.`cf_datasource_permission_member`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `datasource_id` INT(11) NOT NULL,
    `account` VARCHAR(256) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='';

CREATE TABLE `kb-dms`.`cf_datasource_owners`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `datasource_id` INT(11) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `account` VARCHAR(256) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='';

CREATE TABLE `kb-dms`.`cf_datasource`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `group_id` INT(11) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `description` VARCHAR(4096),
    `type` INT(11) NOT NULL COMMENT '1. Mysql 2. Sqlserver 3. mongodb 4. Redis  5. mq',
    `status` INT(11) NOT NULL DEFAULT '-1' COMMENT '-1 失效 1激活',
    `ip` VARCHAR(256),
    `port` INT(11),
    `db` VARCHAR(256),
    `username` VARCHAR(256),
    `password` VARCHAR(256),
    `creator_name` VARCHAR(256),
    `creator_account` VARCHAR(256),
    `create_time` DATETIME NOT NULL,
    `update_time` DATETIME NOT NULL,
    `query_switch` INT(11) NOT NULL DEFAULT '1' COMMENT '1 开启 -1 关闭',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='';

CREATE TABLE `kb-dms`.`cf_bus_module`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45),
    `group_id` INT(11),
    `creator_account` VARCHAR(45),
    `creator_name` VARCHAR(45),
    `create_time` DATETIME,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='';

CREATE TABLE `kb-dms`.`cf_bus_group_users`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `bus_group_id` INT(11) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `account` VARCHAR(256) NOT NULL,
    `creator_name` VARCHAR(256) NOT NULL,
    `creator_account` VARCHAR(256) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='';

CREATE TABLE `kb-dms`.`cf_bus_group_owners`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(256) NOT NULL,
    `account` VARCHAR(256) NOT NULL,
    `bus_group_id` INT(11) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='';

CREATE TABLE `kb-dms`.`cf_bus_group`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(256) NOT NULL COMMENT '创建人',
    `create_time` DATETIME NOT NULL,
    `status` TINYINT(4) NOT NULL DEFAULT '1' COMMENT '1. 激活 -1. 失效',
    `creator_account` VARCHAR(256) NOT NULL,
    `creator_name` VARCHAR(256) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_id_name` (`id`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='sf';

CREATE TABLE `kb-dms`.`cf_admin_config`(
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `account` VARCHAR(256) NOT NULL,
    `create_time` DATETIME NOT NULL,
    `creator_name` VARCHAR(256),
    `creator_account` VARCHAR(256) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `sf` (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='';
