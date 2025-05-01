import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Chat from "@/components/chat";

export default function SideTabs() {
    return (
        <Tabs defaultValue="chat" className="h-[100vh] flex flex-col min-w-[200px] w-1/4">
            <TabsList className="grid grid-cols-2">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="roles">Roles</TabsTrigger>
            </TabsList>

            <TabsContent className="flex flex-col w-full h-full overflow-hidden" value="chat">
                <Chat/>
            </TabsContent>

            <TabsContent value="roles">
            </TabsContent>
        </Tabs>
    )
}