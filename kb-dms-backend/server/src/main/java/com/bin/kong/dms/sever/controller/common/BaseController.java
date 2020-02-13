package com.bin.kong.dms.sever.controller.common;

import com.bin.kong.dms.core.constants.UserInfoConstants;
import com.bin.kong.dms.model.user.entity.UserInfoDTO;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;

@RestController
@Slf4j
public class BaseController {
    protected static SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");

    protected UserInfoDTO getUserInfoDTO() {

        return (UserInfoDTO) SecurityUtils.getSubject().getSession().getAttribute(UserInfoConstants.CURRENT_USER);

    }
}
