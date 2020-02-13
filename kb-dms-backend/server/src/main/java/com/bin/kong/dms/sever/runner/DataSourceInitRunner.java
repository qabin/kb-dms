package com.bin.kong.dms.sever.runner;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class DataSourceInitRunner implements ApplicationRunner {
//    @Resource
//    private MockProxyCache mockProxyCache;
//    @Resource
//    private HostCache hostCache;

    @Override
    public void run(ApplicationArguments args) {
        //mockProxyCache.init();

        //hostCache.init();
    }
}
