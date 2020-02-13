package com.bin.kong.dms.core.utils;

import com.alibaba.fastjson.JSON;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeader;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.net.URI;
import java.util.Map;
import java.util.Set;

public class HttpUtils {
    private static Logger logger = LoggerFactory.getLogger(HttpUtils.class);

    public static String doPost(String url, Map<String, Object> paramsMap, Map<String, String> headersMap) {
        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(url);
        RequestConfig requestConfig = RequestConfig.custom().
                setConnectTimeout(180 * 1000).setConnectionRequestTimeout(180 * 1000)
                .setSocketTimeout(180 * 1000).setRedirectsEnabled(true).build();
        httpPost.setConfig(requestConfig);
        addHeaderToRequest(headersMap, httpPost);
        try {
            StringEntity entity = new StringEntity(JSON.toJSONString(paramsMap), "utf-8");
            entity.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
            entity.setContentEncoding("utf-8");
            httpPost.setEntity(entity);
            HttpResponse response = httpClient.execute(httpPost);
            if (response.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                return EntityUtils.toString(response.getEntity(), HTTP.UTF_8);
            } else {
                logger.error("请求状态异常，状态码：" + response.getStatusLine());
                return null;
            }
        } catch (Exception e) {
            logger.error("请求异常：" + e.getMessage());
            return null;
        } finally {
            if (null != httpClient) {
                try {
                    httpClient.close();
                } catch (IOException e) {
                    logger.error("请求异常：" + e.getMessage());
                }
            }
        }
    }

    public static String doPost(String url, String jsonParams) {
        CloseableHttpClient httpClient = HttpClients.custom().build();
        HttpPost httpPost = new HttpPost(url);
        RequestConfig requestConfig = RequestConfig.custom().
                setConnectTimeout(180 * 1000).setConnectionRequestTimeout(180 * 1000)
                .setSocketTimeout(180 * 1000).setRedirectsEnabled(true).build();

        httpPost.setConfig(requestConfig);
        httpPost.setHeader("Content-Type", "application/json");  //
        try {
            httpPost.setEntity(new StringEntity(jsonParams, "utf-8"));
            HttpResponse response = httpClient.execute(httpPost);
            if (response.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
                return EntityUtils.toString(response.getEntity());
            } else {
                logger.error("请求状态异常，状态码：" + response.getStatusLine());
                return null;
            }
        } catch (Exception e) {
            logger.error("请求异常：" + e.getMessage());
            return null;
        } finally {
            if (null != httpClient) {
                try {
                    httpClient.close();
                } catch (IOException e) {
                    logger.error("请求异常：" + e.getMessage());
                }
            }
        }
    }

    public static String doGet(String url, Map<String, Object> params, Map<String, String> headersMap) {
        CloseableHttpClient httpClient = HttpClients.createDefault();
        String responseContext = "";
        HttpGet httpGet;
        RequestConfig requestConfig = RequestConfig.custom().
                setConnectTimeout(180 * 1000).setConnectionRequestTimeout(180 * 1000)
                .setSocketTimeout(180 * 1000).setRedirectsEnabled(true).build();
        CloseableHttpResponse httpResponse = null;
        try {
            if (params != null && params.size() > 0) {
                URIBuilder builder = new URIBuilder(url);
                Set<String> set = params.keySet();
                for (String key : set) {
                    builder.setParameter(key, String.valueOf(params.get(key)));
                }
                URI uri = builder.build();
                httpGet = new HttpGet(builder.build());
            } else {
                httpGet = new HttpGet(url);
            }
            httpGet.setConfig(requestConfig);
            addHeaderToRequest(headersMap, httpGet);
            httpResponse = httpClient.execute(httpGet);
            HttpEntity httpEntity = httpResponse.getEntity();
            responseContext = EntityUtils.toString(httpEntity, "UTF-8");
        } catch (Exception ex) {
            logger.error("请求异常：" + ex.getMessage());
        } finally {
            try {
                if (null != httpClient) {
                    httpClient.close();
                }
                if (null != httpResponse) {
                    httpResponse.close();
                }
            } catch (IOException e) {
                logger.error("请求异常：" + e.getMessage());
            }
        }
        return responseContext;
    }

    private static void addHeaderToRequest(Map<String, String> headersMap, HttpRequestBase request) {
        if (headersMap != null && headersMap.size() > 0) {
            Header[] headers = new Header[headersMap.size()];
            int i = 0;
            for (Map.Entry<String, String> entry : headersMap.entrySet()) {
                headers[i] = new BasicHeader(entry.getKey(), entry.getValue());
                i++;
            }
            request.setHeaders(headers);
        }
    }
}
