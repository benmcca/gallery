export interface ArtProject {
  id: string;
  title: string;
  description?: string;
  year?: string;
  medium?: string;
  images?: string[];
  order?: number;
}

export class ArtProject {
  static async list(sortBy: string = "order"): Promise<ArtProject[]> {
    try {
      const response = await fetch('/artprojects.json');
      const projects = await response.json();

      if (sortBy === "order") {
        return projects.sort((a: ArtProject, b: ArtProject) =>
          (a.order || 0) - (b.order || 0)
        );
      }

      return projects;
    } catch (error) {
      console.error('Error loading art projects:', error);
      return [];
    }
  }
}
