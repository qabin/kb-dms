package com.bin.kong.dms.contract.user.request;

import com.bin.kong.dms.contract.user.entity.RequestUserInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SqlEditorShareRequest {
    private List<RequestUserInfo> users;
}
