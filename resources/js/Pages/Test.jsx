import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { sanctumRequest } from '../config/sanctumRequest';


export default function Test() {

    async function sendAxios(){
        const response = await sanctumRequest(
            'post',
            '/api/test'
        );
        console.log(response)
    }

    return (
        <div className="mx-4 sm:mx-6 lg:mx-8 py-6">
            <button onClick={sendAxios}>Test!</button>
        </div>
    );
}

// TODO: fix the messages disappearing when navigating with tab.