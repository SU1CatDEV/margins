import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Received({report}) {
    return (
        <AuthenticatedLayout title={"Report received"}>
            <div className="flex justify-center items-center h-full py-10 xs:pb-20 px-10">
                <div className="max-w-full md:max-w-[75%]">
                    <h1 className="text-3xl">Thank you for your report.</h1>
                    <p>We sincerely apologise for any inconvenience. I am just one person, and cannot vet every single book which is uploaded.</p>
                    <p>Users are required to certify that they have the legal right to upload a book. The user will be banned once they have accumulated three violations.</p>
                    <p>Here is your report data as stored in our database:</p>
                    <table className="border-2 border-gray-300 w-full px-8 py-4 block mt-4">
                        {Object.keys(report).map((key) => (
                            <tr className="border-b-2 border-gray-300 flex last:border-b-0">
                                <td className="border-r-2 border-gray-300 w-[20%] block">{key}</td>
                                <td className="w-[80%] ml-5 block">{report[key]}</td>
                            </tr>
                        ))}
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}