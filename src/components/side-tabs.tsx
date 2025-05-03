import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Chat from "@/components/chat";
import RoleList from "@/components/role-list";

export default function SideTabs() {
    return (
        <Tabs defaultValue="chat" className="h-[100vh] flex flex-col min-w-[200px] w-1/4 bg-gray-900">
            <TabsList className="grid grid-cols-2">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="roles">Roles</TabsTrigger>
            </TabsList>

            <TabsContent value="roles">
                <RoleList/>
            </TabsContent>

            <TabsContent className="flex flex-col w-full h-full overflow-hidden" value="chat">
                <Chat/>
            </TabsContent>
        </Tabs>
    )
}