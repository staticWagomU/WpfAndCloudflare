# version.txt�̓��e��ǂݍ���
$version = Get-Content -Path ".\WpfAndCloudflare\Resources\version.txt" -Encoding UTF8

# hoge.csproj�̓��e��ǂݍ���
$csproj = [xml](Get-Content -Path ".\WpfAndCloudflare\WpfAndCloudflare.csproj")
Write-Host $csproj

# AssemblyVersion��FileVersion���X�V����
$csproj.Project.PropertyGroup.AssemblyVersion = $version
$csproj.Project.PropertyGroup.FileVersion = $version

# �ύX��ۑ�����
$csproj.Save(".\WpfAndCloudflare\WpfAndCloudflare.csproj")