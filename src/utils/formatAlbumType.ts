export function formatAlbumType(type: string): string {
  switch (type) {
    case 'album':
      return 'Álbum';
    case 'single':
      return 'Single';
    case 'compilation':
      return 'Compilação';
    default:
      return 'Álbum';
  }
}

export default formatAlbumType;

