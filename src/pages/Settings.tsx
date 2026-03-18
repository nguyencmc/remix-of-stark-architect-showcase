import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Save, Loader2, Shield } from "lucide-react";
import PageHeader from "@/components/layouts/PageHeader";
import {
  useSettings,
  AvatarSection,
  ProfileFormFields,
  ProfileStatsDisplay,
  ViewProfileCard,
  SecurityForm,
} from "@/features/settings";

const Settings = () => {
  const {
    user,
    authLoading,
    loading,
    saving,
    uploading,
    profile,
    fullName,
    setFullName,
    username,
    setUsername,
    bio,
    setBio,
    avatarUrl,
    handleAvatarUpload,
    handleRemoveAvatar,
    handleSave,
    navigate,
  } = useSettings();

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  const fallbackChar = (fullName || username || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <PageHeader
          breadcrumbs={[
            { label: "Trang chủ", href: "/" },
            { label: "Thiết lập tài khoản" },
          ]}
          showBack={true}
          backHref="/"
        />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Thiết lập tài khoản</h1>
          <p className="text-muted-foreground mt-1">Quản lý thông tin cá nhân và bảo mật của bạn</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Hồ sơ cá nhân
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Bảo mật
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6 mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin cá nhân
                </CardTitle>
                <CardDescription>
                  Cập nhật ảnh đại diện và thông tin hiển thị công khai
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <AvatarSection
                  avatarUrl={avatarUrl}
                  uploading={uploading}
                  fallbackChar={fallbackChar}
                  onUpload={handleAvatarUpload}
                  onRemove={handleRemoveAvatar}
                />

                <Separator />

                <ProfileFormFields
                  fullName={fullName}
                  onFullNameChange={setFullName}
                  username={username}
                  onUsernameChange={setUsername}
                  email={user?.email || ""}
                  bio={bio}
                  onBioChange={setBio}
                />

                <Separator />

                {profile && <ProfileStatsDisplay profile={profile} />}

                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving} className="min-w-32">
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Lưu thay đổi
                  </Button>
                </div>
              </CardContent>
            </Card>

            {username && (
              <ViewProfileCard username={username} onNavigate={navigate} />
            )}
          </TabsContent>

          <TabsContent value="security" className="space-y-6 mt-0">
            <SecurityForm />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Settings;
