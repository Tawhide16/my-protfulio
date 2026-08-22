import { notFound } from 'next/navigation';
import { projects } from '@/data/projectsData';
import ProjectDetailsClient from '@/components/ProjectDetailsClient';

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id.toString(),
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = projects.find((p) => p.id.toString() === id);

  if (!project) {
    return {
      title: 'Project Not Found | Tawhid Hasan Bejoy',
    };
  }

  return {
    title: `${project.title} - Case Study | Tawhid Hasan Bejoy`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Tawhid Hasan Bejoy`,
      description: project.description,
      images: [project.image1],
    },
  };
}

export default async function ProjectPage({ params }) {
  const { id } = await params;
  const project = projects.find((p) => p.id.toString() === id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailsClient project={project} />;
}
