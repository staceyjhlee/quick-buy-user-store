
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useProfiles } from "@/hooks/useProfiles";
import Layout from "@/components/Layout";

const Users = () => {
  const { data: profiles, isLoading, error } = useProfiles();

  if (isLoading) {
    return (
      <Layout currentPage="users">
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Loading users...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout currentPage="users">
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Error loading users. Please try again.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="users">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users</h2>
        <Button>Add New User</Button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map(profile => (
              <TableRow key={profile.id}>
                <TableCell className="font-medium">
                  {profile.id.slice(0, 8)}...
                </TableCell>
                <TableCell>{profile.full_name || 'No name'}</TableCell>
                <TableCell>{profile.email || 'No email'}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    customer
                  </Badge>
                </TableCell>
                <TableCell>{profile.orders?.length || 0}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
};

export default Users;
