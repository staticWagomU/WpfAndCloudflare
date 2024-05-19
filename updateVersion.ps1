# version.txtの内容を読み込む
$version = Get-Content -Path ".\WpfAndCloudflare\Resources\version.txt" -Encoding UTF8

# hoge.csprojの内容を読み込む
$csproj = [xml](Get-Content -Path ".\WpfAndCloudflare\WpfAndCloudflare.csproj")
Write-Host $csproj

# AssemblyVersionとFileVersionを更新する
$csproj.Project.PropertyGroup.AssemblyVersion = $version
$csproj.Project.PropertyGroup.FileVersion = $version

# 変更を保存する
$csproj.Save(".\WpfAndCloudflare\WpfAndCloudflare.csproj")