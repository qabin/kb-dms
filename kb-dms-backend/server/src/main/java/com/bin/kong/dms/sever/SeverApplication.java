package com.bin.kong.dms.sever;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ServletComponentScan
@MapperScan("com.bin.kong.dms.dao.mapper.*.**")
@EnableScheduling
@ComponentScan(basePackages = {"com.bin.kong.dms"})
public class SeverApplication {

    public static void main(String[] args) {
        SpringApplication.run(SeverApplication.class, args);
    }

}
