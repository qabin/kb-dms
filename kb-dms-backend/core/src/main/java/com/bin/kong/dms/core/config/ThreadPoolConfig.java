package com.bin.kong.dms.core.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.ThreadPoolExecutor;

@Configuration
@EnableAsync
public class ThreadPoolConfig {
    private int corePoolSize = 10;//线程池维护线程的最少数量

    private int maxPoolSize = 50;//线程池维护线程的最大数量

    private int queueCapacity = 20; //缓存队列

    private int keepAlive = 120;//允许的空闲时间

    @Bean
    public AsyncTaskExecutor threadExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(corePoolSize);
        executor.setMaxPoolSize(maxPoolSize);
        executor.setQueueCapacity(queueCapacity);
        executor.setThreadNamePrefix("threadExecutor-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy()); //对拒绝task的处理策略
        executor.setKeepAliveSeconds(keepAlive);
        executor.initialize();
        return executor;
    }
}
