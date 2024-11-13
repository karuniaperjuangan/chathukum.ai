import { Button, Menu, MenuItem, MenuPopover, MenuTrigger, Text } from "@fluentui/react-components";

export default function LandingPage() {
    return (
        <>
        <nav className="fixed h-16 w-screen bg-slate-400 top-0">
            <div className=" flex">
                <Text as="h2" className="text-xl" size={600}>My Landing Page</Text>
                <div className="flex -1"></div>
                <Menu>
                    <MenuTrigger>
                        <Button>Toggle Menu</Button>
                    </MenuTrigger>
                    <MenuPopover>
                        <MenuItem>Item 1</MenuItem>
                        <MenuItem>Item 2</MenuItem>
                        <MenuItem>Item 3</MenuItem>
                    </MenuPopover>
                </Menu>
            </div>
        </nav>
        <div>
            <Text as="h1" className=" text-4xl" size={600}>Welcome to the landing page!</Text>
        </div>
        </>
    );
}