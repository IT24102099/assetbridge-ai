using AssetBridge.Api.Agent.Models;

namespace AssetBridge.Api.Agent.Rag;

public interface IKnowledgeBaseService
{
    Task<List<KnowledgeDocument>> RetrieveRelevantDocumentsAsync(string query, int topK = 3);
    Task<List<KnowledgeDocument>> GetAllDocumentsAsync();
}
