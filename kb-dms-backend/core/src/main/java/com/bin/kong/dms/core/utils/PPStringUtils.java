package com.bin.kong.dms.core.utils;

import lombok.extern.slf4j.Slf4j;
import net.sf.jsqlparser.JSQLParserException;
import net.sf.jsqlparser.parser.CCJSqlParserManager;
import net.sf.jsqlparser.statement.Statement;
import net.sf.jsqlparser.statement.delete.Delete;
import net.sf.jsqlparser.statement.insert.Insert;
import net.sf.jsqlparser.statement.replace.Replace;
import net.sf.jsqlparser.statement.select.Select;
import net.sf.jsqlparser.statement.update.Update;
import net.sf.jsqlparser.util.TablesNamesFinder;

import java.io.StringReader;
import java.util.List;

@Slf4j
public class PPStringUtils {
    private static CCJSqlParserManager pm = new CCJSqlParserManager();

    public static List<String> getTableNames(String sql) {
        try {
            List<String> tablenames = null;
            TablesNamesFinder tablesNamesFinder = new TablesNamesFinder();
            Statement statement = pm.parse(new StringReader(sql));
            if (statement instanceof Select) {
                tablenames = tablesNamesFinder.getTableList((Select) statement);
            } else if (statement instanceof Update) {
                return null;
            } else if (statement instanceof Delete) {
                return null;
            } else if (statement instanceof Replace) {
                return null;
            } else if (statement instanceof Insert) {
                return null;
            }
            return tablenames;
        } catch (Exception e) {
            log.error("执行getTableNames异常：" + e);
        }
        return null;
    }
}
