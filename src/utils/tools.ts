/**
 * 在字符串中搜索指定字符集合是否存在
 * @param source 要搜索的源字符串
 * @param targets 要查找的字符集合
 * @returns 是否找到任意匹配字符
 * 
 * 實現原理：
 * 1. 使用 Set 結構存儲目標字符，實現 O(1) 查詢複雜度
 * 2. 遍歷源字符串的每個字符進行匹配檢查
 * 3. 使用空間換時間策略，保持 O(n) 時間複雜度
 */
export function hasAnyCharacter(source: string, targets: string[]): boolean {
    // 創建字符查找表
    const targetSet = new Set<string>(targets);

    // 空字符集合直接返回 false
    if (targetSet.size === 0) return false;

    // 使用迭代器遍歷字符串
    for (const char of source) {
        if (targetSet.has(char)) {
            return true; // 發現匹配立即返回
        }
    }

    return false; // 遍歷完畢未發現匹配
}
