package com.bin.kong.dms.core.mybatis;

import com.alibaba.druid.spring.boot.autoconfigure.DruidDataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {
    @Primary
    @Bean
    @ConfigurationProperties("spring.datasource.dms")
    public DataSource dasDms() {
        return DruidDataSourceBuilder.create().build();
    }
}
