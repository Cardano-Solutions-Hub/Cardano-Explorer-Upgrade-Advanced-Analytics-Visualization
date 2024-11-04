function formatHash(hash) {
    if (!hash) return "N/A";
    const start = hash.substring(0, 6);
    const end = hash.substring(hash.length - 6);
    return `${start}...${end}`;
  }

export default formatHash