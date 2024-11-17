import ChooseLawsComponent from "../../components/lawsSelection";


export default function ExploreLawsPage() {

    return (
        <div className=" w-screen max-h-screen h-screen">
        <ChooseLawsComponent isSelectLawsDialogOpen setIsSelectLawsDialogOpen={()=>{}}/>
        </div>
    );
}