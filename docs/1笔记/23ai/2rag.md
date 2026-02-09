# rag

Retrieval（检索）- Augmented（增强）- Generation（生成）

首先将文本切分为 chunk

然后 embedding 将 chunk 转换为向量

chunk 和向量存储啊 vector database 向量数据库

后续可以通过匹配向量之间的余弦相似度来实现语义检索
