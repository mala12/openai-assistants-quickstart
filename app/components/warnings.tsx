const fetchAssistantId = async () => {
  setLoading(true);

  try {
    const response = await fetch("/api/assistants", { method: "POST" });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    setNewAssistantId(data.assistantId);
  } catch (error) {
    console.error("Failed to fetch assistant ID:", error);
  } finally {
    setLoading(false);
  }
};
 
