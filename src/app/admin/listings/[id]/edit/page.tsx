import { ListingFormPage } from '../../../../../_admin/pages/ListingFormPage';
import { listings } from '@/data';

export async function generateStaticParams() {
  return listings.map((l) => ({
    id: l.id.toString(),
  }));
}

export default function AdminListingFormEditRoute() {
  return <ListingFormPage />;
}
