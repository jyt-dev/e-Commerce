import { useDispatch, useSelector } from 'react-redux';
import { upgradeRole } from '@/features/auth/authThunk';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function BecomeSeller() {
    const dispatch = useDispatch();
    const { user, isLoading } = useSelector(state => state.auth);

    const handleUpgradeRole = async () => {
        if(window.confirm("Are you sure you want to upgrade to a SELLER account?")) {
            try {
                await dispatch(upgradeRole()).unwrap();
                toast.success("Role upgraded successfully. Please re-login if changes don't reflect immediately.");
            } catch (err) {
                toast.error(err?.message || "Failed to upgrade role");
            }
        }
    };

    if (user?.role !== 'USER') {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Seller Account</CardTitle>
                    <CardDescription>You are already a SELLER or ADMIN.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Seller Account</CardTitle>
                <CardDescription>Want to sell your own products? Upgrade your account here.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleUpgradeRole} disabled={isLoading}>Upgrade to SELLER</Button>
            </CardContent>
        </Card>
    );
}
