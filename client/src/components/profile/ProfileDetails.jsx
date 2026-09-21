import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAccountDetails, changePassword } from '@/features/auth/authThunk';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ProfileDetails() {
    const dispatch = useDispatch();
    const { user, isLoading } = useSelector(state => state.auth);

    const [accountData, setAccountData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || ''
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: ''
    });

    const handleAccountSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateAccountDetails(accountData)).unwrap();
            toast.success("Account updated successfully");
        } catch (err) {
            toast.error(err?.message || "Failed to update account");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(changePassword(passwordData)).unwrap();
            toast.success("Password changed successfully");
            setPasswordData({ oldPassword: '', newPassword: '' });
        } catch (err) {
            toast.error(err?.message || "Failed to change password");
        }
    };



    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                    <CardDescription>Update your personal information here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAccountSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Name</Label>
                            <Input id="fullName" value={accountData.fullName} onChange={e => setAccountData({...accountData, fullName: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={accountData.email} onChange={e => setAccountData({...accountData, email: e.target.value})} />
                        </div>
                        <Button type="submit" disabled={isLoading}>Save Changes</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="oldPassword">Old Password</Label>
                            <Input id="oldPassword" type="password" value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} />
                        </div>
                        <Button type="submit" disabled={isLoading}>Change Password</Button>
                    </form>
                </CardContent>
            </Card>

        </div>
    );
}
