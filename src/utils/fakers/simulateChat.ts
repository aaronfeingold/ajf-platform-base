// Helper function to generate UUID
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Simulate conversation data
const simulateGetConversations = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    {
      id: generateUUID(),
      title: "Property Analysis Discussion",
      messages: [
        {
          role: "user",
          content: "How do I analyze property values in this area?",
        },
        {
          role: "assistant",
          content:
            "I can help you analyze property values. Would you like to look at comparable sales or current market trends?",
        },
      ],
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      id: generateUUID(),
      title: "Market Research",
      messages: [
        { role: "user", content: "What's the current market trend?" },
        {
          role: "assistant",
          content:
            "The market has shown steady growth over the past quarter. Let me break down the key metrics...",
        },
      ],
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    },
  ];
};

// Simulate creating a new conversation
const simulateCreateConversation = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: generateUUID(),
    title: "New Conversation",
    messages: [
      {
        role: "assistant",
        content: "Hello! How can I help you with property analysis today?",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export { simulateGetConversations, simulateCreateConversation };
