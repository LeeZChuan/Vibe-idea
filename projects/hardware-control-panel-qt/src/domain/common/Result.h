#pragma once

#include <QString>
#include <utility>

namespace hcp::domain {

// 轻量 Result 类型用于领域层返回“成功/失败 + 错误原因”。
// 模板项目先保持简单，真实项目可以替换为 tl::expected、std::expected 或统一错误码体系。
struct Result {
    bool ok { true };
    QString message;

    static Result success()
    {
        return { true, {} };
    }

    static Result failure(QString reason)
    {
        return { false, std::move(reason) };
    }
};

} // namespace hcp::domain
