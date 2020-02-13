package com.bin.kong.dms.core.mybatis;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import javax.sql.DataSource;

@Configuration
@MapperScan(value = "com.bin.kong.dms.dao.mapper.dms", sqlSessionFactoryRef = "sqlSessionFactoryBeanDms")
public class MybatisConfigDms {
    @Autowired
    @Qualifier("dasDms")
    DataSource dasDms;

    @Bean
    SqlSessionFactory sqlSessionFactoryBeanDms() throws Exception {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dasDms);
        factoryBean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath*:/mybatis/**/*.xml"));
        return factoryBean.getObject();
    }

    @Bean
    SqlSessionTemplate sqlSessionTemplateDms() throws Exception {
        return new SqlSessionTemplate(sqlSessionFactoryBeanDms());
    }
}
