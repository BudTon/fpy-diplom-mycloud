export default function filesSize(bytes) {
  if (bytes / Math.pow(1024, 3) >= 1) {
    return {
      "countInt": (bytes / Math.pow(1024, 3)).toFixed(2),
      "countStr": "ГБ",
    }
  }
  if (bytes / Math.pow(1024, 2) >= 1) {
    return {
      "countInt": (bytes / Math.pow(1024, 2)).toFixed(2),
      "countStr": "МБ",
    }
  }

  return {
    "countInt": (bytes / 1024).toFixed(2),
    "countStr": "КБ",
  }
}
