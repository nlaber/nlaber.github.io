
<form action=index.html method=POST>
<input type=text name=pas>
<input type=submit>
</form>

<?PHP 
if (isset($_POST['pas']))
{
 if ($_POST['pas'] == '123')
   {
     include("vk.com");
   }
   else
   {
     echo "access denied";
   } 
}
?>

