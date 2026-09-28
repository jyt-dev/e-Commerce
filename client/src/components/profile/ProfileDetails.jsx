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
            <Card className="rounded-sm shadow-none border-gray-200">
                <CardHeader className="px-6 py-5 border-b border-gray-100">
                    <CardTitle className="text-[18px] font-semibold tracking-tight text-gray-900">Account Details</CardTitle>
                    <CardDescription className="text-[13px] text-gray-500 mt-1">Update your personal information here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAccountSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-[13px] font-medium text-gray-700">Name</Label>
                            <Input id="fullName" className="rounded-sm h-10 text-[14px]" value={accountData.fullName} onChange={e => setAccountData({...accountData, fullName: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[13px] font-medium text-gray-700">Email</Label>
                            <Input id="email" type="email" className="rounded-sm h-10 text-[14px]" value={accountData.email} onChange={e => setAccountData({...accountData, email: e.target.value})} />
                        </div>
                        <Button type="submit" disabled={isLoading} className="rounded-sm h-10 px-6 font-medium text-[14px]">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="rounded-sm shadow-none border-gray-200">
                <CardHeader className="px-6 py-5 border-b border-gray-100">
                    <CardTitle className="text-[18px] font-semibold tracking-tight text-gray-900">Change Password</CardTitle>
                    <CardDescription className="text-[13px] text-gray-500 mt-1">Update your password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="oldPassword" className="text-[13px] font-medium text-gray-700">Old Password</Label>
                            <Input id="oldPassword" type="password" className="rounded-sm h-10 text-[14px]" value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-[13px] font-medium text-gray-700">New Password</Label>
                            <Input id="newPassword" type="password" className="rounded-sm h-10 text-[14px]" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} />
                        </div>
                        <Button type="submit" disabled={isLoading} className="rounded-sm h-10 px-6 font-medium text-[14px]">Change Password</Button>
                    </form>
                </CardContent>
            </Card>

        </div>
    );
}
