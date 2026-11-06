import { PostFormPage } from '../../../../../_admin/pages/PostFormPage';
import { blogPosts } from '@/data';

export async function generateStaticParams() {
  return blogPosts.map((p, idx) => ({
    id: (idx + 1).toString(),
  }));
}

export default function AdminPostFormEditRoute() {
  return <PostFormPage />;
}
