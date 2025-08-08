// Generate a deterministic avatar URL using Dicebear API
export const generateAvatarUrl = (userId, style = "adventurer") => {
  if (!userId) return "/avatar.svg";
  return `https://api.dicebear.com/6.x/${style}/svg?seed=${userId}`;
};

// Generate multiple avatar styles for variety
export const generateMultipleAvatars = (userId) => {
  const styles = ["adventurer", "avataaars", "big-smile", "bottts", "fun-emoji"];
  return styles.map(style => ({
    style,
    url: generateAvatarUrl(userId, style)
  }));
};
