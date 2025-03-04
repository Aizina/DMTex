export function getStarImagePath(rating: number): string {
    const roundedRating = Math.round(rating);
    if (roundedRating < 1 || roundedRating > 5) {
      return '/img/stars/star5.png'; // Provide a default star image
    }
  
    const imagePath = `/img/stars/star${roundedRating}.png`; 
    return imagePath;
  }